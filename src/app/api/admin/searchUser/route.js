import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const username = request.nextUrl.searchParams.get("username");
  try {
    const db = await dbConnect();
    const userCollection = db.collection("users");

    const result = await userCollection.findOne(
        { username: username },
        { projection: { password: 0, notifications: 0 } }
      );
    if (result?._id) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({
        status: 404,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
