import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { commentAuthorUsername, date, postID, commentID, authorName } = body;
  const uniqueID = new ObjectId();
  const replyData = {
    _id: uniqueID,
    reply: body.reply,
    author: body.author,
    likes: [],
    date,
  };
  const db = await dbConnect();
  const postCollection = db.collection("posts");
  const userCollection = db?.collection("users");
  const isBlocked = await userCollection.findOne(
    { username: body.author },
    { projection: { blocked: 1 } }
  );
  if (isBlocked.blocked) {
    return NextResponse.json({
      status: 500,
      message: "You are blocked from commenting. Contact support.",
    });
  }
  try {
    const postData = await postCollection.findOne(
      { _id: new ObjectId(postID) },
      { projection: { followers: 1, author: 1 } }
    );
    await postCollection.updateOne(
      { _id: new ObjectId(postID), "comment._id": new ObjectId(commentID) },
      { $push: { "comment.$.replies": replyData } }
    );

    const postAuthor = postData?.author?.username;
    // const authorReplied = postAuthor === commentAuthorUsername;

    // deleteing comment author username for sending notification to others
    const followers = postData?.followers.filter(
      (u) =>
        u !== body.author && u !== commentAuthorUsername && u !== postAuthor
    );

    const postNotificationForOthers = {
      _id: new ObjectId(),
      message: `${authorName} replied to a comment you are following.`,
      date,
      postID,
      commenterUsername: body.author,
      read: false,
    };

    // updating notifications for users
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
      ]
    );

    const postNotification = {
      _id: new ObjectId(),
      message: "",
      date,
      postID,
      commenterUsername: body.author,
      read: false,
    };

    if (body.author !== postAuthor && commentAuthorUsername === postAuthor) {
      postNotification.message = `${authorName} replied to your comment.`;
      await userCollection.updateOne(
        { username: postAuthor },
        { $push: { notifications: postNotification } }
      );
    }
    else if (body.author !== postAuthor && commentAuthorUsername !== postAuthor) {
      postNotification.message = `${authorName} replied to a comment on your post.`;
      await userCollection.updateOne(
        { username: postAuthor },
        { $push: { notifications: postNotification } }
      );
      postNotification.message = `${authorName} replied to your comment.`;
      await userCollection.updateOne(
        { username: commentAuthorUsername },
        { $push: { notifications: postNotification } }
      );
    }
    return NextResponse.json({
      status: 200,
      _id: uniqueID,
      message: "Reply added",
    });
  } catch {
    return NextResponse.json({
      status: 401,
      message: "Server error",
    });
  }
};
