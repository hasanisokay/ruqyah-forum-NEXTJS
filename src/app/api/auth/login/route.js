import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
/**
 * @type {import("mongodb").Db}
 */
export const POST = async (request) => {
  const body = await request.json();
const username = body.username;
const db = await dbConnect();
const userCollection = db.collection("users");
const user = await userCollection.findOne({username:username})
if(!user){
  return NextResponse.json({ status: 404, message:"Wrong username or password." });
}
const passwordsMatch = await bcrypt.compare(body.password, user.password);
if(passwordsMatch){
  delete user.password;
  return NextResponse.json(user);
}
else{
  return NextResponse.json({ status: 404, message:"Wrong username or password." });
}
  return;
};