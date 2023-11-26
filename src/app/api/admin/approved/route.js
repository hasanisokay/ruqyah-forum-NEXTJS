import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  console.log(body.postID);
//   try {
//       const db = dbConnect();
//       const update = {
//         $set: { status: "approved" },
//       };
//       const filter = { postID, _id: body._id };
//       const postCollection = db.collection("posts");
//       const result = await postCollection.updateOne(filter, update);
//     if (result.matchedCount === 1) {
//       return NextResponse.json({
//         message: "Post updated successfully",
//         status: 200,
//       });
//     } else {
//       return NextResponse.json({ message: "Post not found", status: 404 });
//     }
//   } catch (error) {
//     console.error("Error updating post:", error);
//     return NextResponse.json({ message: "Internal Server Error", status: 500 });
//   }
  return NextResponse.json({ message: "Validation Error", status: 401 });
};
