'use client'
import Image from 'next/image';
import formatRelativeDate from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import React, { useRef, useCallback, useContext, useState, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { FaUserLarge, FaHeart } from "react-icons/fa6"
import AuthContext from '@/contexts/AuthContext';
import truncateText from '@/utils/trancatText';
import formatDateForUserJoined from '@/utils/formatDateForUserJoined';
import axios from 'axios';
import { mutate } from 'swr';
import LoadingCards from '@/components/LoadingCards';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
const fetcher = async (url) => await fetch(url).then((res) => res.json());


const Notifications = () => {
    const { fetchedUser } = useContext(AuthContext);
    const infiniteScrollRef = useRef();
    const lastNotificationRef = useRef(null);
    const router = useRouter();
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.length === 0) return null;
        return `/api/allnotifications?username=${fetchedUser?.username}&page=${pageIndex + 1}`;
    };

    const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);

    // const posts = data ? data.flat() : [];
    const [posts, setPosts] = useState(data ? data.flat() : []);

    useEffect(() => {
        setPosts(data?.flat())
    }, [data])

    const handleScroll = useCallback(() => {
        // Check if the user has scrolled to the bottom
        if (
            infiniteScrollRef.current &&
            window.innerHeight + window.scrollY >= infiniteScrollRef.current.offsetTop
        ) {
            if (size > 0 && (data && (data[size - 1]?.length == undefined || data[size - 1]?.length === 0))) {
                return;
            }
            if (size === 0) {
                // Initial load, do nothing
                return;
            }
            setSize(size + 1);
        }
    }, [setSize, size, data]);

    // Attach the scroll event listener
    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    if (error) return <div>Error loading posts</div>;
    if (!data) return <div>
        <LoadingCards />
        <LoadingCards />
        <LoadingCards />
    </div>
    return (
        <div className='cardinhome'>
            <h1>Notifications</h1>

            <div>
                {posts?.map((notification, index) => (
                    <div
                        className={`my-2 cursor-pointer px-2 py-2 ${notification.read ===false ? "bg-blue-600":""} flex items-center gap-2`}
                        key={index}
                        ref={index === posts.length - 1 ? lastNotificationRef : null}
                        onClick={()=>router.push(`/${notification.postID}`)}
                    >
                         <div>
                            {
                                notification?.commenterPhotoURL ?
                                    <Image src={notification?.commenterPhotoURL} blurDataURL='' alt='User Profile Photo'
                                        width={64} height={0} loading='lazy'
                                        style={{
                                            width: "45px",
                                            height: "45px",
                                            borderRadius: '50%',
                                        }}
                                        className='border-gray-400 border-2'
                                    />
                                    : <div className='flex items-center justify-center rounded-full border-gray-400 border-2 w-[45px] h-[45px]'><FaUserLarge className='' /></div>
                            }
                        </div>
                        <div>
                            <p>{notification?.message}</p>
                            <p>{<span className="block text-xs">{formatRelativeDate(new Date(notification.date)) + " ago"} {" on " + formatDateInAdmin(new Date(notification.date))}</span>}</p>
                        </div>
                    </div>
                ))}
            </div>
            {isValidating && (data[size - 1]?.length != undefined || data[size - 1]?.length != 0) && <div>
                <LoadingCards />
            </div>}
            {size > 0 && !isValidating && (data && (data[size - 1]?.length == undefined || data[size - 1]?.length === 0)) && <div className='py-1 text-center'>
                No more posts
            </div>}
            <div ref={infiniteScrollRef} style={{ height: '10px' }} />
        </div>
    );
};

export default Notifications;
