import { COOKIE_NAME } from "@/constants";
import dbConnect from "@/services/DbConnect";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (request) => {
  const body = await request.json();

  const { previousPassword, newPassword, targetUsername } = body;
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value.split("Bearer")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized", status: 401 });
  }
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
  const { payload } = await jwtVerify(token, secret);
  const { username } = payload;
  if (username !== targetUsername) {
    return NextResponse.json({ message: "Unauthorized", status: 401 });
  }
  const db = await dbConnect();
  const userCollection = db.collection("users");
  const user = await userCollection.findOne(
    { username: targetUsername },
    { projection: { password: 1 } }
  );
  const passwordsMatch = await bcrypt.compare(previousPassword, user.password);
  if (passwordsMatch) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await userCollection.updateOne(
        { username: targetUsername },
        { $set: { password: hashedPassword } }
      );
      if (result.modifiedCount > 0) {
        return NextResponse.json({
          status: 200,
          message: "Password updated.",
        });
      } else {
        return NextResponse.json({
          status: 404,
          message: "Could not update password. Try again",
        });
      }
    } catch {
      return NextResponse.json({
        status: 404,
        message: "Could not update password. Try again",
      });
    }
  } else {
    return NextResponse.json({
      status: 404,
      message: "Wrong password.",
    });
  }
};
