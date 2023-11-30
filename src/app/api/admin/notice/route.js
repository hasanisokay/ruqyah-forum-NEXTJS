import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";
/**
 * @type {import("mongodb").Db}
 */
export const POST = async (request) => {
  const body = await request.json();
  const db = await dbConnect();
  const noticeCollection = db?.collection("notice");
  try {
    await noticeCollection.insertOne(body);
    return NextResponse.json({ status: 200, message: "Posted new notice" });
  } catch {
    return NextResponse.json({
      status: 401,
      message: "Something went wrong. Try again.",
    });
  }
};