import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { username, photoURL } = body;
  const db = await dbConnect();
  const userCollection = db?.collection("users");

  const result = await userCollection.updateOne(
    { username: username },
    { $set: { photoURL: photoURL } }
  );
  if (result.modifiedCount === 1) {
    return NextResponse.json({ message: "Success", status: 200 });
  } else {
    return NextResponse.json({ message: "Error", status: 400 });
  }
};
