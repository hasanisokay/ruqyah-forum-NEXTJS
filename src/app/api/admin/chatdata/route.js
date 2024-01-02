import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await dbConnect();
    const usersCollection = db?.collection("users");
    const result = await usersCollection.find(
      { isAdmin: true },
      { projection: { name: 1, photoURL: 1, username: 1 } }
    ).toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
