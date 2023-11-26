import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";
export const GET = async (request) => {
  const page = parseInt(request.nextUrl.searchParams.get("page")) || 1; // Use default value if request.query is undefined
  const sortOrder = request.nextUrl.searchParams.get("sortOrder") || "desc";
  const searchTerm = request.nextUrl.searchParams.get("searchTerm");
  const actionFilter = request.nextUrl.searchParams.get("actionFilter");
  const db = await dbConnect();
  const adminActivityCollection = db.collection("admin-activity");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  let query = {};

  if (searchTerm) {
    query.$or = [
      { approvedBy: { $regex: searchTerm, $options: 'i' } },
      { declinedBy: { $regex: searchTerm, $options: 'i' } },
      { postAuthor: { $regex: searchTerm, $options: 'i' } },
    ];
  }
  if (actionFilter) {
    query["action"] = actionFilter;
  }
  const sortQuery = { timestamp: sortOrder === "desc" ? -1 : 1 };

  const result = await adminActivityCollection
    .find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(pageSize)
    .toArray();
  return NextResponse.json(result);
};
