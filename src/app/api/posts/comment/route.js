import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  console.log(body);
  const { comment, author, date, postID } = body;
  const db = await dbConnect();

  try {
    const postCollection = db.collection("posts");
    const result = await postCollection.updateOne(
      { _id: new ObjectId(postID) },
      { $push: { comment: { comment, author, date}} }
    );

    if (result.modifiedCount === 1) {
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
