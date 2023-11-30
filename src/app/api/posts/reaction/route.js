import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { postID, action, actionByUsername } = body;
  const db = await dbConnect();

  try {
    const postCollection = db.collection("posts");
    if (action === "like") {
      // Update to add the username to the 'likes' array
      const result = await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        { $push: { likes: actionByUsername } }
      );

      if (result.modifiedCount === 1) {
        return NextResponse.json({
          status: 200,
          message: "Post liked successfully.",
        });
      } else {
        return NextResponse.json({
          status: 400,
          message: "Failed to like the post.",
        });
      }
    } else if (action === "dislike") {
      // Update to remove the username from the 'likes' array
      const result = await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        { $pull: { likes: actionByUsername } }
      );

      if (result.modifiedCount === 1) {
        return NextResponse.json({
          status: 200,
          message: "Post disliked successfully.",
        });
      } else {
        return NextResponse.json({
          status: 400,
          message: "Failed to dislike the post.",
        });
      }
    } else {
      return NextResponse.json({
        status: 400,
        message: "Invalid action. Must be 'like' or 'dislike'.",
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
