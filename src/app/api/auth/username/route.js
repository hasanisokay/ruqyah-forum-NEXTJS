import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";
export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const db = await dbConnect();
  const usernameCollection = db.collection("usernames");
  const result = await usernameCollection
    .find({ username: username })
    .toArray();
    if(result[0]?._id){
        return NextResponse.json({available: false})
    }
    else{
        return NextResponse.json({available: true});
    }
};
