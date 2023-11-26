// pages/api/admin/declinedposts.js
import dbConnect from '@/services/DbConnect';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc';
    const searchTerm = request.nextUrl.searchParams.get('searchTerm');

    const db = await dbConnect();
    const postCollection = db.collection('posts');
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const query = { status: 'declined' };

    if (searchTerm) {
        query['author.name'] = { $regex: searchTerm, $options: 'i' };
    }

    const sortQuery = { date: sortOrder === 'desc' ? -1 : 1 };

    const result = await postCollection.find(query).sort(sortQuery).skip(skip).limit(pageSize).toArray();
    
    return NextResponse.json(result);
};
