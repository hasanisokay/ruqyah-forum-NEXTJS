import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { postID, commentID, replyID } = body;
  const db = await dbConnect();
  const postCollection = db.collection("posts");
  try {
    let result;
    if(replyID){
      result = await postCollection.updateOne({_id: new ObjectId(postID), 'comment._id': new ObjectId(commentID)},{
        $pull: {"comment.$.replies": {_id: new ObjectId(replyID)}}
      })
    }
    if (!replyID) {
      result = await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        { $pull: { comment: { _id: new ObjectId(commentID) } } }
      );
    }
    if (result.modifiedCount === 1) {
      return NextResponse.json({ status: 200, message: `${replyID ? "Reply deleted":"Comment deleted"}` });
    } else {
      return NextResponse.json({
        status: 404,
        message: `${replyID ? "Reply not found. Maybe it is deleted already.":"Comment not found. Maybe it is deleted already."}`,
      });
    }
  } catch (err) {
    return NextResponse.json({
      status: 404,
      message: "Error deleting. Try again",
    });
  }
};
