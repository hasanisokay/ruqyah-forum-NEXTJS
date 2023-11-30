import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;// Use default value if request.query is undefined
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc';
    const searchTerm = request.nextUrl.searchParams.get('searchTerm');
  

  const db = await dbConnect();
  const postCollection = db?.collection("posts");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  let query = { status: 'pending' };

  if (searchTerm) {
    query['author.username'] = { $regex: searchTerm, $options: 'i' };
  }
  const sortQuery = { date: sortOrder === 'desc' ? -1 : 1 };

  // const result = await postCollection.find(query).sort(sortQuery).skip(skip).limit(pageSize).toArray();
  const result = await postCollection
        ?.aggregate([
            {
                $match: query,
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
            {
                $sort: sortQuery,
            },
            {
                $skip: skip,
            },
            {
                $limit: pageSize,
            },
            {
                $project: {
                    post: 1,
                    date: 1,
                    status: 1,
                    author: {
                        username: "$authorInfo.username",
                    },
                    authorInfo: {
                        photoURL: "$authorInfo.photoURL",
                        name: "$authorInfo.name",
                        joined: "$authorInfo.joined",
                    },
                },
            },
        ])
        .toArray();
  return NextResponse.json(result);
};