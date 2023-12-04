import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants";
export const GET = async (request) => {
  const res = new NextResponse(
    JSON.stringify({
      message: "successfully logged out",
    })
  );

  res.cookies.set(COOKIE_NAME, "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });
  return res;
};