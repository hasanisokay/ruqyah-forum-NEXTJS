import dbConnect from "@/services/DbConnect";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { newPasword, username } = body;
  const db = await dbConnect();
  const userCollection = db.collection("users");
  const hashedPassword = await bcrypt.hash(newPasword, 10);
  const result = await userCollection.updateOne(
    { username: username },
    { $set: { password: hashedPassword } }
  );
  console.log(result);
  return NextResponse.json({
    status: 200,
    message: "Success. Please remember your password for future use.",
  });
};
