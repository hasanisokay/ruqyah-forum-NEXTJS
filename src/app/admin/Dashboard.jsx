'use client'
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [postData, setPostData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/getstat');
                const jsonData = await response.json();
                setPostData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2 className='font-semibold text-center text-lg mt-6'>Total counts</h2>
            {postData && (
                <div className='flex items-center flex-col'>
                    <div>
                        <p>Pending Posts: <span className='font-semibold'>{postData.totalPendingPosts}</span></p>
                        <p>Approved Posts: <span className='font-semibold'>{postData.totalApprovedPosts}</span></p>
                        <p>Declined Posts: <span className='font-semibold'>{postData.totalDeclinedPosts}</span></p>
                        <p>Notices: <span className='font-semibold'>{postData.totalNoticesCount}</span></p>
                        <p>Users: <span className='font-semibold'>{postData.totalUsersCount}</span></p>
                        <p>Admins: <span className='font-semibold'>{postData.totalAdminCount}</span></p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
