import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const page = parseInt(request.nextUrl.searchParams.get("page")) || 1;
  const sortOrder = request.nextUrl.searchParams.get("sortOrder") || "desc";
  const searchTerm = request.nextUrl.searchParams.get("searchTerm");
  const actionFilter = request.nextUrl.searchParams.get("actionFilter");

  const db = await dbConnect();
  const adminActivityCollection = db.collection("admin-activity");
  const usersCollection = db.collection("users");

  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  let query = {};

  if (searchTerm) {
    query.$or = [
      { approvedBy: { $regex: searchTerm, $options: 'i' } },
      { declinedBy: { $regex: searchTerm, $options: 'i' } },
      { postAuthorUsername: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  if (actionFilter) {
    query["action"] = actionFilter;
  }

  const sortQuery = { timestamp: sortOrder === "desc" ? -1 : 1 };

  const result = await adminActivityCollection
    .aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "postAuthorUsername",
          foreignField: "username",
          as: "authorInfo",
        },
      },
      { $unwind: { path: "$authorInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          action: 1,
          postAuthorUsername: 1,
          timestamp: 1,
          postID: 1,
          post: 1,
          declinedBy: 1,
          approvedBy: 1,
          // Add other fields you want to include from admin-activity
          "authorInfo.username": 1,
          "authorInfo.name": 1,
          "authorInfo.joined": 1,
          "authorInfo.photoURL": 1,
          // Exclude the password field
        },
      },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: pageSize },
    ])
    .toArray();

  return NextResponse.json(result);
};
