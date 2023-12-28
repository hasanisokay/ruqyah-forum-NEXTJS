import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();

  const { reply, author, commentID, postID, date } = body;
  const uniqueID = new ObjectId();
  const replyData = {
    _id: uniqueID,
    reply,
    author,
    likes: [],
    date,
  };
  const db = await dbConnect();
  const postCollection = db.collection("posts");
  const userCollection = db?.collection("users");
  const isBlocked = await userCollection.findOne(
    { username: author },
    { projection: { blocked: 1 } }
  );
  if (isBlocked?.blocked) {
    return NextResponse.json({
      status: 500,
      message: "You are blocked from commenting. Contact support.",
    });
  }
  try {
    await postCollection.updateOne(
      { _id: new ObjectId(postID), "comment._id": new ObjectId(commentID) },
      {
        $push: {
          "comment.$.replies": replyData,
        },
        $addToSet: {
          followers: author,
        },
      }
    );

    const { followers } = await postCollection.findOne(
      { _id: new ObjectId(postID) },
      { projection: { followers: 1 } }
    );
    const followersToGetNotification = followers.filter(
      (user) => user !== author
    );

    if (followersToGetNotification?.length < 1) {
      return NextResponse.json({
        status: 200,
        _id: uniqueID,
        message: "reply added.",
      });
    }

    // notification area starts
    const newNotification = {
      _id: new ObjectId(),
      type: "reply",
      postID,
      commentID,
      replyID: uniqueID,
      date,
      author,
      read: false,
    };

    const bulkOperations = [];

    bulkOperations.push({
      updateMany: {
        filter: {
          username: { $in: followersToGetNotification },
          "notifications.commentID": commentID,
        },
        update: {
          $set: { "notifications.$[elem]": newNotification },
        },
        arrayFilters: [{ "elem.commentID": commentID }],
      },
    });

    bulkOperations.push({
      updateMany: {
        filter: {
          username: { $in: followersToGetNotification },
          "notifications.commentID": { $ne: commentID },
        },
        update: {
          $push: { notifications: newNotification },
        },
      },
    });

    await userCollection.bulkWrite(bulkOperations, {
      ordered: false,
    });

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
