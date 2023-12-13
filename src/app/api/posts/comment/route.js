import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { comment, author, date, postID, name, postAuthorUsername } = body;
  const db = await dbConnect();
  try {
    const postCollection = db?.collection("posts");
    const userCollection = db?.collection("users");
    const isBlocked = await userCollection.findOne(
      { username: author.username },
      { projection: { blocked: 1 } }
    );
    if (isBlocked.blocked) {
      return NextResponse.json({
        status: 500,
        message: "You are blocked from commenting. Contact support.",
      });
    }
    const uniqueID = new ObjectId()
    if (postAuthorUsername === author.username) {
      await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        {
          $push: {
            comment: {
              _id: uniqueID,
              comment,
              author,
              date,
              likes: [],
              replies: [],
            },
          },
        }
      );
    } else {
      await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        {
          $push: {
            comment: {
              _id: uniqueID,
              comment,
              author,
              date,
              likes: [],
              replies: [],
            },
          },
          $addToSet: {
            followers: author.username,
          },
        }
      );
    }
    const { followers } = await postCollection.findOne(
      { _id: new ObjectId(postID) },
      { projection: { followers: 1 } }
    );

    // checking if the commenter is not the author. if not then send notifications to author.
    if (author.username !== postAuthorUsername) {
      const postNotification = {
        _id: new ObjectId(),
        message: `${name} commented on your post.`,
        date: new Date(),
        postID,
        commenterUsername: author.username,
        read: false,
      };
      await userCollection.updateOne(
        { username: postAuthorUsername },
        { $push: { notifications: postNotification } }
      );
    }

    // checking if only post author commented before or there was no other comment before.
    if (followers?.length < 1) {
      return NextResponse.json({
        status: 200,
        _id: uniqueID,
        message: "Commented successfully.",
      });
    }

    const postNotificationForOthers = {
      _id: new ObjectId(),
      message: `${name} commented on a post you are following.`,
      date: new Date(),
      postID,
      commenterUsername: author.username,
      read: false,
    };

    // Update notifications for users in previousCommenters
     await userCollection.updateMany(
      {
        username: { $in: followers },
      },
      [
        {
          $set: {
            notifications: {
              $cond: {
                if: { $eq: ["$element.postID", postID] },
                then: "$element.notifications",
                else: {
                  $concatArrays: [
                    { $ifNull: ["$element.notifications", []] },
                    [postNotificationForOthers],
                  ],
                },
              },
            },
          },
        },
      ],
    );

    return NextResponse.json({
      status: 200,
      _id: uniqueID,
      message: "Commented successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};
