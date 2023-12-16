import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { otp, username } = body;
  const db = await dbConnect();
  const userCollection = db.collection("users");
  const result = await userCollection.findOne(
    { username: username },
    { projection: { resetOTP: 1 } }
  );
  const expiration = result?.resetOTP?.expirationTime;
  const currentTimestamp = new Date().getTime();
  const timeDifference = currentTimestamp - expiration;
  const tenMinutesInMilliseconds = 10 * 60 * 1000;
  
  if (timeDifference < 0 && parseInt(otp) === result?.resetOTP?.value) {
    return NextResponse.json({ status: 200, message: "OTP matched" });
  } 
  else if (timeDifference >= tenMinutesInMilliseconds) {
    return NextResponse.json({ status: 403, message: "OTP expired. Request a new OTP." });
  }  
  else{
    return NextResponse.json({status:404, message:"OTP mismatch. Check email and try again."})
  }
};
