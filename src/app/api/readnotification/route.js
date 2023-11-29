import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { id, username } = body;

  try {
    // Connect to the database
    const db = await dbConnect();

    // Get the user collection
    const userCollection = db.collection("users");

    // Update the notifications array
    const result = await userCollection.updateOne(
        {
            username: username,
            "notifications.postID": id,
          },
          {
            $set: {
              "notifications.$[element].read": true,
            },
          },
          {
            arrayFilters: [{ "element.postID": id }],
          }
        );

    if (result.matchedCount > 0) {
        return new NextResponse({
            status: 200,
            message: "Notifications updated successfully",
          });
    } else {
        return new NextResponse({
            status: 404,
            message: "Not Found",
          });
    }
  } catch (error) {
    return new NextResponse({
        status: 500,
        message: "Internal Server Error",
      });
  }



};
