import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { date, type, commentID, replyID, postID, reportBY } = body;
  try {
    const db = await dbConnect();
    const reportCollection = db.collection("reports");
    const userCollection = db.collection("users");
    await reportCollection.insertOne(body);

    const newNotification = {
      _id: new ObjectId(),
      type: "report",
      postID,
      commentID,
      replyID,
      date,
      author: reportBY,
      read: false,
      content: type
    };

    await userCollection.updateMany(
      { isAdmin: true },
      {
        $push: { notifications: newNotification },
      }
    );
    return NextResponse.json({
      status: 200,
      message: "JazakAllah Khairan for your contribution.",
    });
  } catch {
    return NextResponse.json({
      status: 400,
      message: "Please try again.",
    });
  }
};
