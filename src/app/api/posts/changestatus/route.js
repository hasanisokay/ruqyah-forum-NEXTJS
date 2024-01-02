import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const {
    postID,
    action,
    actionBy,
    postAuthorUsername,
    updateActivityLogID,
    deleteAll,
    approveAll,
    declineAll,
  } = body;

  const db = await dbConnect();
  try {
    const postCollection = db?.collection("posts");
    const userCollection = db?.collection("users");
    const adminActivityCollection = db?.collection("admin-activity");
    if (deleteAll) {
      await postCollection.deleteMany({ status: "declined" });
      await adminActivityCollection.deleteMany({ status: "decline" });
      return NextResponse.json({
        message: "All Declined post deleted",
        status: 200,
      });
    }
    if (approveAll) {
      const updateFields = {
        status: "approved",
        approvedBy: actionBy,
        approveDate: new Date(),
      };
      await postCollection.updateMany(
        { status: "pending" },
        { $set: updateFields }
      );

      return NextResponse.json({
        message: "All pending post approved",
        status: 200,
      });
    }
    if (declineAll) {
      const updateFields = {
        status: "declined",
        declinedBy: actionBy,
        declineDate: new Date(),
      };
      await postCollection.updateMany(
        { status: "pending" },
        { $set: updateFields }
      );

      return NextResponse.json({
        message: "All pending post declined",
        status: 200,
      });
    }

    const post = await postCollection.findOne(
      { _id: new ObjectId(body?.postID) },
      { projection: { _id: 1 }}
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found", status: 404 });
    }
    if (action === "delete") {
      await postCollection.deleteOne({ _id: new ObjectId(postID) });
      return NextResponse.json({
        message: "Deleted Permanently",
        status: 200,
      });
    }
    if (action === "approve") {
      const updateFields = {
        status: "approved",
        approveDate: new Date(),
        approvedBy: actionBy,
      };
      // Update the post status to "approved"
      await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        { $set: updateFields }
      );

      const newNotification = {
        _id: new ObjectId(),
        type: "approve",
        commentID: null,
        date: new Date(),
        postID,
        author: actionBy,
        read: false,
      };

      await userCollection.updateOne(
        { username: postAuthorUsername },
        { $push: { notifications: newNotification } }
      );

      if (updateActivityLogID) {
        await adminActivityCollection.updateOne(
          { postID: postID },
          {
            $set: {
              action: "approve",
              approvedBy: actionBy,
              declinedBy: "",
              timestamp: new Date(),
            },
          }
        );
      } else {
        await adminActivityCollection.insertOne({
          action: "approve",
          postID,
          approvedBy: actionBy,
          postAuthorUsername,
          timestamp: new Date(),
        });
      }
    } else if (action === "decline") {
      await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        {
          $set: {
            status: "declined",
            declineDate: new Date(),
            declinedBy: actionBy,
          },
        }
      );
      const newNotification = {
        _id: new ObjectId(),
        type: "declined",
        commentID: null,
        date: new Date(),
        postID,
        author: actionBy,
        read: false,
      };
      await userCollection.updateOne(
        { username: postAuthorUsername },
        { $push: { notifications: newNotification } }
      );

      await adminActivityCollection.insertOne({
        action: "decline",
        postID,
        post: post.post,
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
