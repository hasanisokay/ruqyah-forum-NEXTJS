import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { id, editedText, previousText } = body;
  const db = await dbConnect();
  const postCollection = db.collection("posts");
  try {
    await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { post: editedText },
        $push: {
          editHistory: {
            previousPost: previousText,
            date: new Date(),
          },
        },
      }
    );
    return NextResponse.json({ status: 200, message: "Edited Successfully." });
  } catch {
    return NextResponse.json({
      status: 400,
      message: "Server error. Try again later.",
    });
  }
};
