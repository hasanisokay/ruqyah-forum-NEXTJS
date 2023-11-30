import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async () => {
    const db = await dbConnect();
    const postCollection = db?.collection("posts");
    const noticeCollection = db?.collection("notice");
    const usersCollection = db?.collection("users");

    try {
        // Count the number of posts with different statuses
        const totalPendingPosts= await postCollection.countDocuments({ status: "pending" });
        const totalApprovedPosts= await postCollection.countDocuments({ status: "approved" });
        const totalDeclinedPosts= await postCollection.countDocuments({ status: "declined" });

        // Count the number of notices
        const totalNoticesCount = await noticeCollection.countDocuments();

        // Count the number of users
        const totalUsersCount = await usersCollection.countDocuments();
        const totalAdminCount = await usersCollection.countDocuments({isAdmin:true});

        return NextResponse.json({
            totalPendingPosts,
            totalApprovedPosts,
            totalDeclinedPosts,
            totalUsersCount,
            totalNoticesCount,
            totalAdminCount,
        });
    } catch (error) {
        console.error("Error counting documents:", error);
        return NextResponse.error("Internal Server Error");
    }
};
