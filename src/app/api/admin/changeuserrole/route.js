import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";
/**
 * @type {import("mongodb").Db}
 */
export const POST = async (request) => {
  const body = await request.json();
  const db = await dbConnect();
  const { username, action, actionBy } = body;
  const userCollection = db?.collection("users");
  const rulesActivityCollection = db?.collection("rules-activity");
  if (username === "rafael") {
    return NextResponse.json({
      status: 401,
      message: "You can't block Rafael Hasan. He creates this forum.",
    });
  }
  try {
    if (action === "make-admin") {
      await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { isAdmin: true } }
      );
      await rulesActivityCollection.insertOne({
        actionBy: actionBy,
        action: "Make Admin",
        targetUser: username,
        timestamp: new Date(),
      });
      return NextResponse.json({
        status: 200,
        message: `${username} is now Admin`,
      });
    }
    if (action === "delete") {
      await userCollection.deleteOne({ username: username });
      await rulesActivityCollection.insertOne({
        actionBy: actionBy,
        action: "Delete User",
        targetUser: username,
        timestamp: new Date(),
      });
      return NextResponse.json({
        status: 200,
        message: `User ${username} deleted`,
      });
    }
    if (action === "block") {
      await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { blocked: true } }
      );
      await rulesActivityCollection.insertOne({
        actionBy: actionBy,
        action: "Block",
        targetUser: username,
        timestamp: new Date(),
      });
      return NextResponse.json({
        status: 200,
        message: `User ${username} blocked`,
      });
    }
    if (action === "unblock") {
      await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { blocked: false } }
      );
      await rulesActivityCollection.insertOne({
        actionBy: actionBy,
        action: "Unblock",
        targetUser: username,
        timestamp: new Date(),
      });
      return NextResponse.json({
        status: 200,
        message: `User ${username} unblocked`,
      });
    }

    return NextResponse.json({
      status: 404,
      message: "Something went wrong. Try again.",
    });
  } catch {
    return NextResponse.json({
      status: 401,
      message: "Something went wrong. Try again.",
    });
  }
};
