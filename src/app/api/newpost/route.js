import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";
/**
 * @type {import("mongodb").Db}
 */
export const POST = async (request) => {
  const body = await request.json();
  const db = await dbConnect();

  const postCollection = db?.collection("posts");
  try {
    const username = body?.author?.username;
    console.log(username);
    const previousPostCount = await postCollection.countDocuments({'author.username': username, status:"pending"})
    console.log(previousPostCount);
    if(previousPostCount === 2 || previousPostCount > 2){
      return NextResponse.json({
        status: 401,
        message: "You have 2 posts pending already. New post is not allowed.",
      });
    }
    if (!body?.status) {
      body.status = "pending";
    }
    await postCollection.insertOne(body);
    return NextResponse.json({
      status: 200,
      message: "Posted. Wait for admin approval.",
    });
  } catch {
    return NextResponse.json({
      status: 401,
      message: "Something went wrong. Try again.",
    });
  }
};
