import dbConnect from "@/services/DbConnect";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
/**
 * @type {import("mongodb").Db}
 */
export const POST = async (request) => {
  const body = await request.json();
  const password = body.password;
  const username = body.username;
  const hashedPassword = await bcrypt.hash(password, 10);
  body.password = hashedPassword;
  const db = await dbConnect();
  const userCollection = db.collection("users");
  const usernameCollection = db.collection("usernames");
  try {
    body.isAdmin = false;
    body.comment = [];
    body.notifications = [];
    await userCollection.insertOne(body);
    await usernameCollection.insertOne({ username });
    NextResponse.json({ status: 200, message: "User Created" });
  } catch {
    NextResponse.json({ status: 404, message: "Something went wrong" });
  }
};
// hasanvai
