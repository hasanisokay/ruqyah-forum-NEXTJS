import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { usernames } = body;
  const db = await dbConnect();

  try {
    const userCollection = db.collection("users");
    const userData = await userCollection
      .find(
        { username: { $in: usernames } },
        { projection: { _id: 0, username: 1, photoURL: 1, name: 1 } }
      )
      .toArray();
    return NextResponse.json({ userData });
  } catch {
    return NextResponse.json({
      status: 404,
      message: "Server Error. Please try again",
    });
  }
};
