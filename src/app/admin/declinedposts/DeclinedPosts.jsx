'use client'
// DeclinedPosts.js
import useSWRInfinite from 'swr/infinite';
import Image from 'next/image';
import { FaUserLarge } from 'react-icons/fa6';
import formatRelativeDate from '@/utils/formatDate';

import axios from 'axios';
import toast from 'react-hot-toast';
import truncateText from '@/utils/trancatText';
import LoadinginPenginPosts from '../pending-posts/LoadingPendingPost';
import AuthContext from '@/contexts/AuthContext';
import React, { useRef, useCallback, useContext, useState, useEffect } from 'react';
import { mutate } from 'swr';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import PhotosInPost from '@/components/PhotosInPost';

const fetcher = (url) => fetch(url).then((res) => res.json());

const DeclinedPosts = () => {
    const { fetchedUser } = useContext(AuthContext);
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order is descending
    const [searchTerm, setSearchTerm] = useState('');
    const [searchText, setSearchText] = useState('');
    const infiniteScrollRef = useRef();
    const [posts, setPosts] = useState([])
    const [expandedPosts, setExpandedPosts] = useState([]);
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.length === 0) return null;
        return `/api/admin/declinedposts?page=${pageIndex + 1}`;
    };
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const { data, error, size, setSize, isValidating } = useSWRInfinite(
        (pageIndex, previousPageData) => {
            if (previousPageData && previousPageData.length === 0) return null;

            const params = new URLSearchParams();
            params.append('page', pageIndex + 1);
            params.append('sortOrder', sortOrder);
            params.append('searchTerm', searchTerm);

            return `/api/admin/declinedposts?${params.toString()}`;
        },
        fetcher
    );

    const pageSize = 10;
    useEffect(()=>{
        if(data){
            setPosts(data.flat())
        }
    },[data])
    const handleToggleExpand = (postId) => {
        setExpandedPosts((prevExpandedPosts) => {
            if (prevExpandedPosts.includes(postId)) {
                // Post is expanded, so collapse it
                return prevExpandedPosts.filter((id) => id !== postId);
            } else {
                // Post is collapsed, so expand it
                return [...prevExpandedPosts, postId];
            }
        });
    };
    const handleShowLess = (postId) => {
        setExpandedPosts((prevExpandedPosts) => prevExpandedPosts.filter((id) => id !== postId));
    };
    const handleScroll = useCallback(() => {
        // Check if the user has scrolled to the bottom
        if (
            infiniteScrollRef.current &&
            window.innerHeight + window.scrollY >= infiniteScrollRef.current.offsetTop
        ) {
            if (size > 0 && (data && (data[size - 1]?.length == undefined || data[size - 1]?.length === 0))) {
                return
            }
            setSize(size + 1)
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
        <LoadinginPenginPosts />
    </div>
    const handleDeletePermanently = async (id, username,) => {
        const dataToSend = { actionBy: fetchedUser.name, postAuthorUsername: username, postID: id, action: "delete" }
        const toastID = toast.loading("Declining...")
        const { data } = await axios.post("/api/posts/changestatus", dataToSend)
        toast.dismiss(toastID)
        mutate()
        if (data.status === 200) {
            toast.success(data.message)
        }
        else {
            toast.error("Internal Server Error. Please try again")
        }
    }
    const handleApprovePost = async (id, username) => {
        const dataToSend = { actionBy: fetchedUser?.name, postAuthorUsername: username, postID: id, action: "approve", updateActivityLogID:true }
        const toastID = toast.loading("Approving...")
        const { data } = await axios.post("/api/posts/changestatus", dataToSend)
        toast.dismiss(toastID)
        mutate()

        if (data.status === 200) {
            toast.success(data.message)
        }
        else {
            toast.error("Internal Server Error. Please try again")
        }

    }
    const handleDeleteAll = async () => {
        const dataToSend = { deleteAll: true, actionBy:fetchedUser?.name}
        const toastID = toast.loading("Deleting...")
        const { data } = await axios.post("/api/posts/changestatus", dataToSend)
        toast.dismiss(toastID)
        mutate()
        if (data.status === 200) {
            toast.success(data.message)
        }
        else {
            toast.error("Internal Server Error. Please try again")
        }
    }
    const sortedPosts = posts.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const filteredPosts = searchTerm
        ? sortedPosts.filter((post) =>
            post.author.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : sortedPosts;
    return (
        <div>
            <div className="my-4 flex flex-col md:flex-row gap-2 items-center justify-center">
                <label htmlFor="sortOrder" className="mr-2">
                    Sort By:
                </label>
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="mr-4"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
                <form onSubmit={() => setSearchTerm(searchText)}>
                    <input
                        type="text"
                        className='rounded-lg focus:outline-none'
                        placeholder="Search by username"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </form>
       
                {
                    posts?.length > 0 && <div className='text-center my-2 ml-1 '>
                        <button className='forum-btn1 bg-red-600' onClick={() => document.getElementById('my_modal_2').showModal()}>Delete All Permanently</button>
                    </div>
                }
                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box text-center">
                        <h3 className="font-bold text-lg">Sure to do this?</h3>
                        <button onClick={handleDeleteAll} className='forum-btn1 bg-red-600'>Yes, I want to delete all</button>
                    </div>
                    <form method="dialog" className="modal-backdrop cursor-default">
                        <button className='cursor-default'></button>
                    </form>
                </dialog>
            </div>
            <div>
                {posts?.map((post) => (
                    <div key={post?._id} className='p-2 cursor-default border-2 m-2 rounded-lg dark:border-gray-400 cardinhome'>
                        <div className='flex gap-2 items-center'>
                            <div>
                                {
                                    post?.authorInfo?.photoURL ?
                                        <Image src={post?.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
                                            width={64} height={0} 
                                            priority={true}
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
                            <div className='py-2'>
                                <p className='font-semibold'>{post?.authorInfo?.name}</p>
                                <div className='text-xs flex gap-2 items-center'>
                                    <p className=''>@{post?.authorInfo?.username}</p>
                                    <p className='' title={post?.date}>Post Date: {formatDateInAdmin(new Date(post?.date))}</p>
                                </div>
                                <p className='text-xs'> Declined By: {post?.declinedBy || "n/a"}</p>
                                <p className='text-xs'> Declined Date: {formatDateInAdmin(new Date(post?.declineDate))}</p>
                            </div>
                        </div>
                        <p style={{ whiteSpace: "pre-wrap" }}>{expandedPosts.includes(post?._id) ? post?.post : truncateText(post?.post)}
                            {!expandedPosts.includes(post._id) && post?.post?.length > 200 && (
                                <button onClick={() => handleToggleExpand(post?._id)} className='text-xs font-semibold'>... Show more</button>
                            )}
                            {expandedPosts.includes(post._id) && (
                                <button onClick={() => handleShowLess(post?._id)} className='text-xs font-semibold pl-1'>Show less </button>
                            )}
                        </p>
                        {
                            post?.photos && < PhotosInPost photosArray={post?.photos}/>
                        }
                        <div className='flex items-center gap-6 mt-2'>
                            <div className='flex items-center flex-col cursor-pointer' >
                                <span onClick={() => handleApprovePost( post?._id, post?.authorInfo?.username)} className='forum-btn1 bg-[#308853] lg:hover:bg-[#0f361f]'> Approve</span>
                            </div>
                            <div className='flex flex-col items-center'>
                                <span onClick={() => handleDeletePermanently(post?._id, post?.authorInof?.username)} className='forum-btn1 bg-red-600 lg:hover:bg-red-900'> Delete Permanently</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isValidating && (data[size - 1]?.length != undefined || data[size - 1]?.length != 0) && (
                <div>
                    <LoadinginPenginPosts />
                </div>
            )}

            {size > 0 && !isValidating && (data && (data[size - 1]?.length == undefined || data[size - 1]?.length === 0)) && (
                <div className='py-1 text-center'>
                    No more declined posts
                </div>
            )}

            {/* Infinite scrolling trigger */}
            <div ref={infiniteScrollRef} style={{ height: '10px' }} />
        </div>
    );
};

export default DeclinedPosts;
