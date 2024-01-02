import dbConnect from '@/services/DbConnect';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc';
    const searchTerm = request.nextUrl.searchParams.get('searchTerm');

    const db = await dbConnect();
    const postCollection = db?.collection('posts');
    const usersCollection = db?.collection('users');

    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const query = { status: 'declined' };

    if (searchTerm) {
        query['author.username'] = { $regex: searchTerm, $options: 'i' };
    }

    const sortQuery = { date: sortOrder === 'desc' ? -1 : 1 };

    const result = await postCollection
        ?.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author.username',
                    foreignField: 'username',
                    as: 'authorInfo',
                },
            },
            { $unwind: { path: '$authorInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    post: 1,
                    date: 1,
                    photos:1,
                    status: 1,
                    declineDate: 1,
                    declinedBy: 1,
                    'authorInfo.username': 1,
                    'authorInfo.name': 1,
                    'authorInfo.photoURL': 1,
                },
            },
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: pageSize },
        ])
        .toArray();

    return NextResponse.json(result);
};
