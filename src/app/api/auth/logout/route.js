import { NextResponse } from "next/server";

export const POST = async (request) => {
  const res = new NextResponse(
    JSON.stringify({
      message: "successfully logged out",
    })
  );

  res.cookies.set("jwt-token", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  return res;
};