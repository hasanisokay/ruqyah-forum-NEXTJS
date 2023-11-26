import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  console.log(body);
  const {
    postID,
    action,
    actionBy,
    postAuthor,
    postAuthorUsername,
    authorPhotoURL,
    updateActivityLogID,
    deleteAll,
    approveAll
  } = body;

  const db = await dbConnect();
  try {
    const postCollection = db.collection("posts");
    const adminActivityCollection = db.collection("admin-activity");
    if(deleteAll){
      await postCollection.deleteMany({status:"declined"})
      await adminActivityCollection.deleteMany({status:"decline"})
      return NextResponse.json({
        message:"All Declined post deleted", status: 200});
    }
    if(approveAll){
      const updateFields = {
        status: "approved",
        approvedBy: approvedBy,
        approveDate: new Date(),
      };

      await postCollection.updateMany({ status: "pending" }, { $set: updateFields });

      return NextResponse.json({
        message:"All pending post approved", status: 200});
    }
    // Retrieve the post from the postCollection
    const post = await postCollection.findOne({ _id: new ObjectId(postID) });

    if (!post) {
      return NextResponse.json({ error: "Post not found", status: 404 });
    }

    if(action ==="delete"){
      await postCollection.deleteOne({ _id: new ObjectId(postID)})
      return NextResponse.json({
        message:"Deleted Permanently", status: 200,
      });
    }
    if (action === "approve") {
      const updateFields = {
        status: "approved",
        approveDate: new Date(),
      };
      // Update the post status to "approved"
      await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        { $set: updateFields }
      );
      if (updateActivityLogID) {
        await adminActivityCollection.updateOne( { _id: new ObjectId(updateActivityLogID)},  { $set: {
          action: "approve",
          approvedBy: actionBy,
          declinedBy: "",
          timestamp: new Date(),
        }} )
      } else {
        await adminActivityCollection.insertOne({
          action: "approve",
          postID,
          approvedBy: actionBy,
          postAuthor,
          postAuthorUsername,
          timestamp: new Date(),
        });
      }
    } else if (action === "decline") {
      await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        { $set: { status: "declined", declineDate: new Date() }}
      );
      await adminActivityCollection.insertOne({
        action: "decline",
        postID,
        post: post.post,
        postAuthor,
        postAuthorUsername,
        declinedBy: actionBy,
        timestamp: new Date(),
      });
    }
    return NextResponse.json({
      message:
        action === "approve"
          ? "Approved successfully"
          : "Declined successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error performing action:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};
