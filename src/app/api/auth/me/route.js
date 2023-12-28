import { COOKIE_NAME } from "@/constants";
import dbConnect from "@/services/DbConnect";
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

  const { payload } = await jwtVerify(token, secret);
  try {
    const { username } = payload;
    const db = await dbConnect();
    const userCollection = db?.collection("users");
    const user = await userCollection
      .aggregate([
        { $match: { username: username } },
        {
          $addFields: {
            unreadNotificationCount: {
              $reduce: {
                input: "$notifications",
                initialValue: 0,
                in: {
                  $cond: {
                    if: { $eq: ["$$this.read", false] },
                    then: { $add: ["$$value", 1] },
                    else: "$$value",
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            password: 0,
            notifications: 0,
            resetOTP: 0,
          },
        },
      ])
      .toArray();
    return NextResponse.json(user[0]);
  } catch {
    return NextResponse.json({ message: "Validation Error", status: 401 });
  }
};
