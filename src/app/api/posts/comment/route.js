import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { comment, author, date, postID } = body;
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

    // this id is for sending to the db and front end(to send with socket)
    const uniqueID = new ObjectId();

    // adding comment and username to the followers array.
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
          followers: author?.username,
        },
      }
    );
    // comment added and commenter to the followers list.

    // notification part starts from here.
    // first getting all the follwers of the post.
    const { followers } = await postCollection.findOne(
      { _id: new ObjectId(postID) },
      { projection: { followers: 1 } }
    );
    // remove comment author from the followers to send notification others.
    const followersToGetNotification = followers?.filter(
      (user) => user !== author.username
    );

    // checking if only post author commented before or there was no other comment before.
    if (followersToGetNotification?.length < 1) {
      return NextResponse.json({
        status: 200,
        _id: uniqueID,
        message: "Commented successfully.",
      });
    }

    const newNotification = {
      _id: new ObjectId(),
      type: "comment",
      commentID: uniqueID,
      date,
      postID,
      author: author.username,
      read: false,
    };
    // Update user collection with a single query
    await userCollection.updateMany(
      {
        username: { $in: followersToGetNotification },
      },
      {
        $push: { notifications: newNotification },
      }
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
