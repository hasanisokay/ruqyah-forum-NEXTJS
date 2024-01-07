'use client'

import getStats from '@/utils/getStats';
import { useEffect, useState } from 'react';
import OnlineUsersCounter from './OnlineUsersCounter';

const PostStat = () => {
    const [stats, setStats] = useState([])
    const [loggedInUsersCount, setLoggedInUsersCount] = useState(0);
    const [anonymousUsersCount, setAnonymousUsersCount] = useState(0);
    useEffect(() => {
        (async () => {
            const data = await getStats();
            setStats(data);
        })()
    }, [])
    return (
        <div >
            <div className='flex flex-col items-center justify-center my-4 py-4 bg-[#fffef9] cardinhome shadow-xl dark:bg-[#242526]'>
                <h1 className='statsHeaderTitle'>Post Stats</h1>
                <div>
                    <p>Pending Posts: <span className='font-semibold'>{stats?.totalPendingPosts}</span></p>
                    <p>Approved Posts: <span className='font-semibold'>{stats?.totalApprovedPosts}</span></p>
                    <p>Declined Posts: <span className='font-semibold'>{stats?.totalDeclinedPosts}</span></p>
                    <p>Notices: <span className='font-semibold'>{stats?.totalNoticesCount}</span></p>
                </div>
            </div>
            <div className='flex cardinhome flex-col items-center justify-center my-4 py-4 bg-[#fffef9] shadow-xl dark:bg-[#242526]'>
                <h1 className='statsHeaderTitle'>User Stats</h1>
                <div>
                    <OnlineUsersCounter anonymousUsersCount={anonymousUsersCount} loggedInUsersCount={loggedInUsersCount} setLoggedInUsersCount={setLoggedInUsersCount} setAnonymousUsersCount={setAnonymousUsersCount} />
                    <p>Total Users: <span className='font-semibold'>{stats?.totalUsersCount}</span></p>
                    <p>Admins: <span className='font-semibold'>{stats?.totalAdminCount}</span></p>
                    <p>Online Logged Users: <span className='font-semibold'>{loggedInUsersCount}</span></p>
                    <p>Online Anonymous Users: <span className='font-semibold'>{anonymousUsersCount}</span></p>
                </div>
            </div>
        </div>
    );
};

export default PostStat;