import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { username } = await request.json();
  try {
    const db = await dbConnect();
    const userCollection = db.collection("users");
    await userCollection.updateOne(
      { username: username },
      { $set: { notifications: [] } }
    );
    return NextResponse.json({ status: 200, message: "Cleared" });
  } catch {
    return NextResponse.json({ status: 500, message: "Error! Try again later." });
  }
};
