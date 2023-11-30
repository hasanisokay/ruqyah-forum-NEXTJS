// import dbConnect from "@/services/DbConnect";
// import { NextResponse } from "next/server";
// /**
//  * @type {import("mongodb").Db}
//  */
// export const POST = async (request) => {
//   const body = await request.json();
//   const { postID,actionBy } = body;
//   const db = await dbConnect();
//   const postCollection = db.collection("posts");
//   try {
//     await postCollection.deleteOne();
//     return NextResponse.json({ status: 200, message: "Posted new notice" });
//   } catch {
//     return NextResponse.json({
//       status: 401,
//       message: "Something went wrong. Try again.",
//     });
//   }
// };