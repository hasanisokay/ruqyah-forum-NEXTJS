import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const groupId = request.nextUrl.searchParams.get("groupId");
  const page = parseInt(request.nextUrl.searchParams.get("page")) || 1;

  const pageSize = 20;
  const skip = (page - 1) * pageSize;
  try {
    const db = await dbConnect();
    const messagesCollection = db.collection("messages");
    const messages = await messagesCollection
      .find({ groupId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();
    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json({ status: 500, message: "Message error" });
  }
};
