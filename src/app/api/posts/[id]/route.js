import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const parts = request.nextUrl.pathname.split("/");
const id = parts[parts.length - 1]

  if (!id) {
    return NextResponse.json({ error: "Post ID is required", status: 400 });
  }
  const db = await dbConnect();
  const postCollection = db.collection("posts");

  try {
    const post = await postCollection.aggregate([
      {
          $match: { _id: new ObjectId(id), status: "approved" },
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
          $project: {
              _id: 1,
              post: 1,
              date: 1,
              comment: 1,
              likes: 1,
              approveDate: 1,
              authorInfo: {
                  name: 1,
                  username: 1,
                  photoURL: 1,
                  joined: 1,
                  isAdmin: 1,
              },
          },
      },
  ]).toArray();
    if (!post) {
      return NextResponse.json({ error: "Post not found", status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};
