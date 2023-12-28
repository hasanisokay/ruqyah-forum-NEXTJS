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
        $project: {
          _id: 0,
          notifications: 1,
        },
      },
      { $unwind: "$notifications" },
      {
        $sort: { "notifications.date": -1 },
      },
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
          let: {
            postId: "$notifications.postID",
            commentID: "$notifications.commentID",
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$postId" }] },
              },
            },
            {
              $project: {
                postAuthor: "$author",
                commentAuthor: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$comment",
                        as: "comment",
                        cond: {
                          $eq: [
                            "$$comment._id",
                            { $toObjectId: "$$commentID" },
                          ],
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          ],
          as: "postData",
        },
      },
      {
        $project: {
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
                    else: "$postData.postAuthor",
                  },
                },
                commentAuthor: {
                  $cond: {
                    if: { $eq: ["$postData", []] },
                    then: null,
                    else: "$postData.commentAuthor.author",
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
          notifications: {
            $slice: ["$notifications", skip, pageSize],
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
