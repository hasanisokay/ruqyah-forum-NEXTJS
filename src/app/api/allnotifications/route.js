import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const username = request.nextUrl.searchParams.get("username");
  const page = parseInt(request.nextUrl.searchParams.get("page") || 1);

  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
    const db = await dbConnect();
    const userCollection = db?.collection("users");

    const aggregationPipeline = [
      { $match: { username: username } },
      {
        $lookup: {
          from: "users",
          localField: "notifications.commenterUsername",
          foreignField: "username",
          as: "commenterInfo",
        },
      },
      {
        $unwind: "$notifications",
      },
      {
        $sort: { "notifications.date": -1 },
      },
      {
        $group: {
          _id: "$_id",
          notifications: {
            $push: {
              message: "$notifications.message",
              date: "$notifications.date",
              postID: "$notifications.postID",
              commenterUsername: "$notifications.commenterUsername",
              read: "$notifications.read",
              commenterPhotoURL: {
                $arrayElemAt: [
                  "$commenterInfo.photoURL",
                  {
                    $indexOfArray: [
                      "$commenterInfo.username",
                      "$notifications.commenterUsername",
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          notifications: {
            $slice: [
              "$notifications",
              skip,
              pageSize,
            ],
          },
        },
      },
    ];
    
    
    
    

    const result = await userCollection
      .aggregate(aggregationPipeline)
      .toArray();

    if (result.length > 0) {

      return NextResponse.json(result[0]?.notifications || []);
    } else {
      return NextResponse.json({
        status: 404,
        body: "User not found",
      });
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({
      status: 500,
      body: "Internal Server Error",
    });
  }
};