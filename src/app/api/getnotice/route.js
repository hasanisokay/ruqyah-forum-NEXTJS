import dbConnect from "@/services/DbConnect"
import { NextResponse } from "next/server"

export const GET = async ()=>{
    const db = await dbConnect();
    const noticeCollection = db?.collection("notice");
   try{
    const result = await noticeCollection?.find().sort({date:-1}).toArray();
    return NextResponse.json(result)
   }
   catch{
    return NextResponse.json({status:500, message:"Error"})
   }
}
