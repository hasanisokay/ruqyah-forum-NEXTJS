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
  
    const user = await userCollection.aggregate([
      { $match: { username: username } },
      {
        $project: {
          _id: 0,
          username: 1,
          name: 1,
          email: 1,
          phone: 1,
          gender: 1,
          photoURL: 1,
          joined: 1,
          isAdmin: 1,
          blocked: 1,
          resetOTP: 1,
          notifications: { $slice: ["$notifications", -10] },
        },
      },
      { $unwind: "$notifications" },
      {
        $lookup: {
          from: "users",
          localField: "notifications.author",
          foreignField: "username",
          as: "authorData",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "notifications.postID",
          foreignField: "_id",
          as: "postData",
        },
      },
      {
        $project: {
          username: 1,
          name: 1,
          email: 1,
          phone: 1,
          gender: 1,
          photoURL: 1,
          joined: 1,
          isAdmin: 1,
          blocked: 1,
          resetOTP: 1,
          notifications: {
            $mergeObjects: [
              "$notifications",
              {
                author: {
                  username: "$notifications.author",
                  photoURL: { $arrayElemAt: ["$authorData.photoURL", 0] },
                  name: { $arrayElemAt: ["$authorData.name", 0] },
                },
                postAuthor: {
                  $cond: {
                    if: { $eq: ["$postData", []] },
                    then: null,
                    else: "$postData.author",
                  },
                },
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$username",
          data: { $first: "$$ROOT" },
          notifications: { $push: "$notifications" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$data", { notifications: "$notifications" }],
          },
        },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          name: 1,
          email: 1,
          phone: 1,
          gender: 1,
          photoURL: 1,
          joined: 1,
          isAdmin: 1,
          blocked: 1,
          resetOTP: 1,
          notifications: 1,
        },
      },
    ]).toArray();
    console.log(user);
    return NextResponse.json(user[0]);
  } catch {
    return NextResponse.json({ message: "Validation Error", status: 401 });
  }
};
