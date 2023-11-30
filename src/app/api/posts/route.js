import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const page = parseInt(request.nextUrl.searchParams.get("page")) || 1; // Use default value if request.query is undefined

  const db = await dbConnect();
  const postCollection = db?.collection("posts");
  const usersCollection = db?.collection("users");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const result = await postCollection.aggregate([
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
            as: "authorInfo"
        }
    },
    {
        $unwind: "$authorInfo"
    },
    {
        $project: {
            _id: 1,
            post: 1,
            date: 1,
            comment: 1,
            likes: 1,
            'authorInfo.name': 1,
            'authorInfo.photoURL': 1,
            'authorInfo.isAdmin': 1,
            'authorInfo.joined': 1,
            'authorInfo.username': 1,
        }
    }
]).toArray();


  return NextResponse.json(result);
  // const result = await postCollection.find({ status: "approved" }).sort({ date: -1 }).skip(skip).limit(pageSize).toArray();
};
