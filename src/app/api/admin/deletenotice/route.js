import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
/**
 * @type {import("mongodb").Db}
 */
export const POST = async (request) => {
  const body = await request.json();
  const db = await dbConnect();

  const noticeCollection = db?.collection("notice");
  try {
    await noticeCollection.deleteOne({ _id: new ObjectId(body.id) });
    return NextResponse.json({ status: 200, message: "Deleted" });
  } catch {
    return NextResponse.json({
      status: 401,
      message: "Something went wrong. Try again.",
    });
  }
};
