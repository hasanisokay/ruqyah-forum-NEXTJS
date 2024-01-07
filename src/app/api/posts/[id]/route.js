import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const parts = request.nextUrl.pathname.split("/");
  const id = parts[parts.length - 1];

  if (!id || id.length !== 24) {
    return NextResponse.json({ error: "Post ID is required", status: 400 });
  }
  const db = await dbConnect();

  if (!db)
    return NextResponse.json({
      status: 400,
      message: "Database connection error",
    });

  try {
    const postCollection = db?.collection("posts");
    const post = await postCollection
      ?.aggregate([
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
          $unwind: {
            path: "$comment",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "comment.author.username",
            foreignField: "username",
            as: "comment.authorInfo",
          },
        },
        {
          $unwind: {
            path: "$comment.authorInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { "comment.date": -1 },
        },
        {
          $group: {
            _id: "$_id",
            post: { $first: "$post" },
            date: { $first: "$date" },
            photos: { $first: "$photos" },
            videos: { $first: "$videos" },
            comment: {
              $push: {
                author: {
                  username: "$comment.author.username",
                  authorInfo: {
                    name: "$comment.authorInfo.name",
                    photoURL: "$comment.authorInfo.photoURL",
                    isAdmin: "$comment.authorInfo.isAdmin",
                  },
                },
                comment: "$comment.comment",
                likes: "$comment.likes",
                date: "$comment.date",
                _id: "$comment._id",
                replies: { $size: { $ifNull: ["$comment.replies", []] } },
              },
            },
            likes: { $first: "$likes" },
            approveDate: { $first: "$approveDate" },
            authorInfo: {
              $first: {
                name: "$authorInfo.name",
                username: "$authorInfo.username",
                photoURL: "$authorInfo.photoURL",
                joined: "$authorInfo.joined",
                isAdmin: "$authorInfo.isAdmin",
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            post: 1,
            date: 1,
            comment: 1,
            photos: 1,
            videos: 1,
            likes: 1,
            approveDate: 1,
            authorInfo: {
              name: 1,
              username: 1,
              photoURL: 1,
              isAdmin: 1,
            },
          },
        },
      ])
      .toArray();

    // console.log(post);
    if (!post || post.length === 0) {
      return NextResponse.json({ error: "Post not found", status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};

// this works fine,
//     const post = await postCollection.aggregate([
//   {
//     $match: { _id: new ObjectId(id), status: "approved" },
//   },
//   {
//     $lookup: {
//       from: "users",
//       localField: "author.username",
//       foreignField: "username",
//       as: "authorInfo",
//     },
//   },
//   {
//     $unwind: "$authorInfo",
//   },
//   {
//     $unwind: "$comment",
//   },
//   {
//     $lookup: {
//       from: "users",
//       localField: "comment.author.username",
//       foreignField: "username",
//       as: "comment.authorInfo",
//     },
//   },
//   {
//     $unwind: "$comment.authorInfo",
//   },
//   {
//     $group: {
//       _id: "$_id",
//       post: { $first: "$post" },
//       date: { $first: "$date" },
//       comment: {
//         $push: {
//           author: {
//             username: "$comment.author.username",
//             authorInfo: {
//               name: "$comment.authorInfo.name",
//               photoURL: "$comment.authorInfo.photoURL",
//               isAdmin: "$comment.authorInfo.isAdmin",
//             },
//           },
//           comment: "$comment.comment",
//           date: "$comment.date",
//         },
//       },
//       likes: { $first: "$likes" },
//       approveDate: { $first: "$approveDate" },
//       authorInfo: {
//         $first: {
//           name: "$authorInfo.name",
//           username: "$authorInfo.username",
//           photoURL: "$authorInfo.photoURL",
//           joined: "$authorInfo.joined",
//           isAdmin: "$authorInfo.isAdmin",
//         },
//       },
//     },
//   },
//   {
//     $project: {
//       _id: 1,
//       post: 1,
//       date: 1,
//       comment: 1,
//       likes: 1,
//       approveDate: 1,
//       authorInfo: 1,
//     },
//   },
// ]).toArray();
