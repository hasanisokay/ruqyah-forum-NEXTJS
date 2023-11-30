import { COOKIE_NAME } from "@/constants";
import dbConnect from "@/services/DbConnect";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const cookieStore = cookies();
  const body = await request.json();
  const { username, photoURL } = body;
  const db = await dbConnect();
  const userCollection = db?.collection("users");
  const postCollection = db?.collection("posts");
  const result = await userCollection.updateOne(
    { username: username },
    { $set: { photoURL: photoURL } }
  );
  if (result.modifiedCount === 1) {
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const alg = "HS256";
    const jwt = await new SignJWT(body)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("90d")
      .sign(secret);

    cookies().set({
      name: COOKIE_NAME,
      value: `Bearer${jwt}`,
      secure: true,
      httpOnly: true,
    });
  } else {
    console.log(`User ${username} not found or photoURL not updated`);
    return NextResponse.json({ message: "Error", status: 400 });
  }

  return NextResponse.json({ message: "Success", status: 200 });
};
