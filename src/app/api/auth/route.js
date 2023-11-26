import { COOKIE_NAME } from "@/constants";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
  const alg = "HS256";

  const jwt = await new SignJWT(body)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  cookies().set({
    name: COOKIE_NAME,
    value: `Bearer${jwt}`,
    secure: true,
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60, 
  });
  return NextResponse.json({ message: "Token created" });
};