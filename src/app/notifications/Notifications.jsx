'use client'
import Image from 'next/image';
import formatRelativeDate from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import React, { useRef, useCallback, useContext, useState, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import { FaUserLarge, FaHeart } from "react-icons/fa6"
import AuthContext from '@/contexts/AuthContext';
import LoadingCards from '@/components/LoadingCards';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import toast from 'react-hot-toast';
import axios from 'axios';
import notificationMaker from '@/utils/notificationMaker';
import LoadingNotifications from '@/components/LoadingNotificaions';

const fetcher = async (url) => await fetch(url).then((res) => res.json());

const Notifications = () => {
    const { fetchedUser, setAllNotifications, setNotificationsCount, loading } = useContext(AuthContext);
    const infiniteScrollRef = useRef();
    const router = useRouter();
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.length === 0) return null;
        return `/api/allnotifications?username=${fetchedUser?.username}&page=${pageIndex + 1}`;
    };

    const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);
    const [posts, setPosts] = useState(data ? data.flat() : []);

    useEffect(() => {
        setPosts(data?.flat())
    }, [data])
    const clearAllNotifications = async () => {
        if (!fetchedUser) {
            return toast.error("Unauthorized")
        }
        try {
            const { data } = await axios.post(`/api/clearnotification`, { username: fetchedUser.username })
            if (data.status === 200) {
                setAllNotifications([])
                setNotificationsCount(0)
                toast.success(data.message)
                router.push("/");
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleScroll = useCallback(() => {
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


    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!fetchedUser && !loading) router.replace("/");
        }
    }, [fetchedUser, router, loading]);

    const handleClickOnNotification = async (id, read, commentID="") => {
        if (read === false) {
            const data = await axios.post("/api/readnotification", { id, username: fetchedUser.username })
            if (data.status === 200) {
                setAllNotifications((prev) => {
                    prev?.map((notification) => {
                        if (notification?.postID === id) {
                            return { ...notification, read: true };
                        }
                        return notification;
                    })
                })
            }
            setNotificationsCount((prev) => prev > 1 ? prev - 1 : 0)
        }
        return router.push(`/${id}?commentID=${commentID}`)
    }
    if (!data) return <div className='cardinhome'>
        <LoadingNotifications />
    </div>

    if (error) return <div className='text-center'>Error loading notifications</div>;
    if (posts?.length < 1 || (posts && posts[0] && posts[0]?.status === 404)) {
        return <p className='text-center font-semibold'>No notification available</p>
    }
    return (
        <div className='cardinhome'>
            <h1 className='font-semibold text-center'>Notifications</h1>
            <div className='text-right'>
                <button onClick={clearAllNotifications} className='py-1 px-2 text-xs'>Clear All</button>
            </div>
            <div>

                <ul>
                    {posts?.map((n, index) => (
                        <li
                            key={index}
                            onClick={() => handleClickOnNotification(n?.postID, n?.read, n?.commentID)}
                            title={`On ${formatDateInAdmin(new Date(n?.date))}`}
                            className={`p-2 font-normal  rounded-lg lg:hover:bg-slate-800 lg:hover:text-white cursor-pointer my-2 ${n.read === false ? "dark:text-white" : "text-gray-400 lg:hover:text-gray-400"
                                }`}
                        > <div className="flex gap-[6px] items-center">
                                {n?.author?.photoURL ?
                                    <Image src={n?.author?.photoURL} blurDataURL='' alt={`profile photo of ${n?.author?.name}`}
                                        width={30} height={0} loading='lazy'
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: '50%',
                                        }}
                                        className='border-gray-400 border-[1.5px]'
                                    />
                                    : <div className='flex items-center justify-center rounded-full border-gray-400 border-[1.5px] w-[30px] h-[30px] p-[4px]'><FaUserLarge /></div>
                                }
                                <div className="flex flex-col">
                                    <p>
                                        {notificationMaker(n?.author?.name, n?.type, n?.commentAuthor ? n?.commentAuthor[0]?.username : undefined, n?.postAuthor ? n?.postAuthor[0]?.username : undefined, fetchedUser?.username, n?.content)}
                                    </p>
                                    <p className={`text-[10px] ${n.read === false ? "text-blue-600" : "text-gray-400"} `}>
                                        {formatRelativeDate(new Date(n.date)) + " ago"}
                                    </p>
                                </div>
                            </div>
                        </li>))}
                </ul>
            </div>
            {isValidating && (data[size - 1]?.length != undefined || data[size - 1]?.length != 0) && <div>
                <LoadingCards />
            </div>}
            {size > 0 && !isValidating && (data && (data[size - 1]?.length == undefined || data[size - 1]?.length === 0)) && <div className='py-1 text-center'>
                No more notifications
            </div>}
            <div ref={infiniteScrollRef} style={{ height: '10px' }} />
        </div>
    );
};

export default Notifications;
