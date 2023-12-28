import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { commentID, replyID, newReply, newComment, postID } = body;
  const db = await dbConnect();
  const postCollection = db.collection("posts");

  try {
    if (!replyID && commentID) {
      const result = await postCollection.updateOne(
        { _id: new ObjectId(postID), "comment._id": new ObjectId(commentID) },
        { $set: { "comment.$.comment": newComment } }
      );
      if (result.modifiedCount === 1)
        return NextResponse.json({ status: 200, message: "Comment edited" });
      else
        return NextResponse.json({
          status: 400,
          message: "Could not update comment. Try again.",
        });
    }
    if (replyID && commentID) {
        const result = await postCollection.updateOne(
            {
              _id: new ObjectId(postID),
              "comment._id": new ObjectId(commentID),
              "comment.replies._id": new ObjectId(replyID),
            },
            {
              $set: {
                "comment.$[c].replies.$[r].reply": newReply,
              },
            },
            {
              arrayFilters: [
                { "c._id": new ObjectId(commentID) },
                { "r._id": new ObjectId(replyID) },
              ],
            }
          );
          
      if (result.modifiedCount === 1)
        return NextResponse.json({ status: 200, message: "Reply edited" });
      else
        return NextResponse.json({
          status: 400,
          message: "Could not update reply. Try again.",
        });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500, message: "Server Error" });
  }
};
