import { COOKIE_NAME } from "@/constants";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value.split("Bearer")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized", status: 401 });
  }
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
  try {
    const { payload } = await jwtVerify(token, secret);
    const { username, email, name, gender, phone, joined, isAdmin, photoURL } = payload;
    return NextResponse.json({ username, email, name, gender, phone, joined, isAdmin, photoURL });
  } catch {
    return NextResponse.json({ message: "Validation Error", status: 401 });
  }
};
