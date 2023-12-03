import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async () => {
    const db = await dbConnect();
    const postCollection = db.collection("posts");
    const noticeCollection = db.collection("notice");
    const usersCollection = db.collection("users");

    try {
        const [postStats, noticeStats, userStats] = await Promise.all([
            // Aggregate for post statistics
            postCollection.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } },
                {
                    $group: {
                        _id: null,
                        totalPendingPosts: { $sum: { $cond: [{ $eq: ["$_id", "pending"] }, "$count", 0] } },
                        totalApprovedPosts: { $sum: { $cond: [{ $eq: ["$_id", "approved"] }, "$count", 0] } },
                        totalDeclinedPosts: { $sum: { $cond: [{ $eq: ["$_id", "declined"] }, "$count", 0] } },
                    },
                },
            ]).toArray(),

            // Aggregate for notice statistics
            noticeCollection.aggregate([{ $group: { _id: null, totalNoticesCount: { $sum: 1 } } }]).toArray(),

            // Aggregate for user statistics
            usersCollection.aggregate([
                { $group: { _id: null, totalUsersCount: { $sum: 1 }, totalAdminCount: { $sum: { $cond: [{ $eq: ["$isAdmin", true] }, 1, 0] } } }} 
            ]).toArray(),
        ]);

        return NextResponse.json({
            ...postStats[0],
            ...noticeStats[0],
            ...userStats[0],
        });
    } catch (error) {
        console.error("Error counting documents:", error);
        return NextResponse.error("Internal Server Error");
    }
};
