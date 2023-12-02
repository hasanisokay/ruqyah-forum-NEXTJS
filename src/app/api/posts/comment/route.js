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
    const updatedDocument = await postCollection.findOneAndUpdate(
      { _id: new ObjectId(postID) },
      { $push: { comment: { comment, author, date } } },
      { returnDocument: "after" }
    );

    const usernames = updatedDocument.comment.reduce((accumulator, comment) => {
      const username = comment.author.username;
      accumulator.add(username);
      return accumulator;
    }, new Set());
    if (usernames.has(author.username)) {
      usernames.delete(author.username);
    }

    const prevCommenters = Array.from(usernames);
    const newNotification = {
      message: `${name} commented on a post you are following.`,
      date: new Date(),
      postID,
      commenterUsername: author.username,
      read: false
    };
    if(author.username !==postAuthorUsername){
      prevCommenters.push(postAuthorUsername)
    };
    if (prevCommenters) {
      const result = await userCollection.updateMany(
        { username: { $in: prevCommenters }},
        { $push: { notifications: newNotification } }
      );
      if (result.modifiedCount > 0) {
        return NextResponse.json({
          status: 200,
          message: "Commented successfully.",
        });
      } else {
        return NextResponse.json({
          status: 200,
          message: "Commented but failed to update notifications",
        });
      }
    }
    if (updatedDocument) {
      return NextResponse.json({
        status: 200,
        message: "Commented successfully.",
      });
    } else {
      return NextResponse.json({
        status: 400,
        message: "Failed to comment.",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};
