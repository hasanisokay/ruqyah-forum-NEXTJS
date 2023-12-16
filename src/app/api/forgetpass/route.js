import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export const POST = async (request) => {
  const body = await request.json();
  const { username, email } = body;
  const db = await dbConnect();
  const userCollection = db.collection("users");
  const result = await userCollection.findOne(
    { username: username, email: email },
    { projection: { _id: 1, name: 1 } }
  );
  if (result?._id) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const sendOTPEmail = async (email, otp) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Password Reset OTP",
        text: `Dear ${result?.name}, \n\nYour OTP for password reset is: ${otp}. It will expire within 10 minutes from now. \n\nTeam Ruqyahbd Forum `,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info?.accepted);
        }
      });
    };
    sendOTPEmail(email, otp);

    const expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() + 10 * 60 * 1000);

    await userCollection.updateOne(
      { _id: new ObjectId(result._id) },
      {
        $set: {
          resetOTP: {
            value: otp,
            expirationTime: expirationTime,
          },
        },
      }
    );
    return NextResponse.json({
      status: 200,
      message: "We have sent you an OTP. Please check your email.",
    });
  } else {
    return NextResponse.json({
      status: 404,
      message: "Invalid username or email.",
    });
  }
};
