import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";
/**
 * @type {import("mongodb").Db}
 */
export const POST = async (request) => {
  const body = await request.json();
  const db = await dbConnect();

  const postCollection = db.collection("posts");
  try {
    body.status = "pending";
    await postCollection.insertOne(body);
    return NextResponse.json({ status: 200, message: "Posted. Wait for admin approval." });
  } catch {
    return NextResponse.json({
      status: 401,
      message: "Something went wrong. Try again.",
    });
  }
};
