import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const page = parseInt(request.nextUrl.searchParams.get("page")) || 1;
  const db = await dbConnect();
  const postCollection = db?.collection("posts");
  if (!db)
    return NextResponse.json({
      status: 400,
      message: "Database connection error",
    });
  try {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const result = await postCollection
      .aggregate([
        {
          $match: { status: "approved" },
        },
        {
          $sort: { date: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: pageSize,
        },
        {
          $lookup: {
            from: "users",
            localField: "author.username",
            foreignField: "username",
            as: "authorInfo",
          },
        },
        {
          $unwind: "$authorInfo",
        },
        // replies: { $size: { $ifNull: ["$comment.replies", []] } }
        {
          $project: {
            _id: 1,
            post: 1,
            date: 1,
            comment: { $size: { $ifNull: ["$comment", []] } },
            photos: 1,
            videos: 1,
            likes: 1,
            "authorInfo.name": 1,
            "authorInfo.photoURL": 1,
            "authorInfo.isAdmin": 1,
            "authorInfo.joined": 1,
            "authorInfo.username": 1,
          },
        },
      ])
      .toArray();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ status: 404, message: "Error on server" });
  }

  // const result = await postCollection.find({ status: "approved" }).sort({ date: -1 }).skip(skip).limit(pageSize).toArray();
};
