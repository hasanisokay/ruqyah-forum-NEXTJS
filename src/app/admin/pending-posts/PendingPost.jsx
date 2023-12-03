
'use client'
import formatRelativeDate from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import React, { useRef, useCallback, useContext, useState, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import Image from 'next/image'
import { FaUserLarge } from "react-icons/fa6"
import truncateText from '@/utils/trancatText';
import LoadinginPenginPosts from './LoadingPendingPost';
import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import formatDateForUserJoined from '@/utils/formatDateForUserJoined';
const fetcher = (url) => fetch(url).then((res) => res.json());

const PendingPost = () => {
    const { fetchedUser } = useContext(AuthContext);
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order is descending
    const [searchTerm, setSearchTerm] = useState('');
    const [searchText, setSearchText] = useState('');
    const infiniteScrollRef = useRef();
    const [expandedPosts, setExpandedPosts] = useState([]);
    const router = useRouter();
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.length === 0) return null;
        return `/api/posts/pendingposts?page=${pageIndex + 1}`;
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

            return `/api/posts/pendingposts?${params.toString()}`;
        },
        fetcher
    );
    const [posts, setPosts] = useState([])
    useEffect(() => {
        if (data) {
            setPosts(data?.flat())
        }
    }, [data])
    const pageSize = 10;
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
    const handleDeclinePost = async (id, username) => {
        const dataToSend = { actionBy: fetchedUser.username, postAuthorUsername: username, postID: id, action: "decline" }
        const toastID = toast.loading("Declining...")
        const { data } = await axios.post("/api/posts/changestatus", dataToSend)
        toast.dismiss(toastID)
        mutate()
        if (data.status === 200) {
            toast.success(data.message)
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
        }
        else {
            toast.error("Internal Server Error. Please try again")
        }
    }
    const handleApprovePost = async (id, username) => {
        const dataToSend = { actionBy: fetchedUser.username, postAuthorUsername: username, postID: id, action: "approve" }
        const toastID = toast.loading("Approving...")
        const { data } = await axios.post("/api/posts/changestatus", dataToSend)
        toast.dismiss(toastID)
        mutate()
        if (data.status === 200) {
            toast.success(data.message)
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
        }
        else {
            toast.error("Internal Server Error. Please try again")
        }
    }
    const handleApproveAll = async () => {
        const dataToSend = { approveAll: true, actionBy: fetchedUser.username, }
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
    const handleDeclineAll = async () => {
        const dataToSend = { declineAll: true, actionBy: fetchedUser.username, }
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
    const sortedPosts = posts.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const filteredPosts = searchTerm
        ? sortedPosts.filter((post) =>
            post?.authorInfo?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        )
        : sortedPosts;
    return (
        <div>
            <div className="my-4 flex items-center justify-center">
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
                        className='border-2 rounded-lg'
                        placeholder="Search by username"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </form>

            </div>
            <div className='flex gap-4 items-center justify-center'>
                {
                    posts?.length > 0 && <div className='text-center my-2'>
                        <button className='forum-btn1 bg-red-600' onClick={() => document.getElementById('my_modal_2').showModal()}>Approve All</button>
                    </div>
                }
                {
                    posts?.length > 0 && <div className='text-center my-2'>
                        <button className='forum-btn1 bg-red-600' onClick={() => document.getElementById('my_modal_0').showModal()}>Decline All</button>
                    </div>
                }
            </div>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box text-center">
                    <h3 className="font-bold text-lg">Sure to do this?</h3>
                    <button onClick={handleApproveAll} className='forum-btn1 bg-[#308853]'>Yes, I want to approve all</button>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            <dialog id="my_modal_0" className="modal">
                <div className="modal-box text-center">
                    <h3 className="font-bold text-lg">Sure to do this?</h3>
                    <button onClick={handleDeclineAll} className='forum-btn1 bg-red-500'>Yes, I want to decline all</button>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {posts.map((post) => (
                <div key={post._id} className='p-2 cursor-default border-2 m-2 rounded-lg dark:border-gray-400 cardinhome '>
                    <div className='flex gap-2 items-center'>
                        <div>
                            {
                                post?.authorInfo?.photoURL ?
                                    <Image src={post?.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
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
                        <div className='py-2'>
                            {/* todo: fetch name with aggregate with username */}
                            <p className='font-semibold'>{post?.authorInfo?.name}</p>
                            <div className='text-xs flex gap-2 items-center'>
                                <p className=''>@{post?.author?.username}</p>
                                <p className='' title={post.date}> {formatDateInAdmin(new Date(post.date))}</p>
                            </div>
                            <p className='text-xs'>Member since {formatDateForUserJoined(new Date(post?.authorInfo?.joined))}</p>
                        </div>
                    </div>
                    <p style={{ whiteSpace: "pre-wrap" }}>{expandedPosts.includes(post._id) ? post?.post : truncateText(post?.post)}
                        {!expandedPosts.includes(post._id) && post?.post?.length > 200 && (
                            <button onClick={() => handleToggleExpand(post._id)} className='text-xs font-semibold'>... Show more</button>
                        )}
                        {expandedPosts.includes(post._id) && (
                            <button onClick={() => handleShowLess(post._id)} className='text-xs font-semibold pl-1'>Show less </button>
                        )}
                    </p>
                    <div className='flex items-center gap-6 mt-2'>
                        <div className='flex items-center flex-col cursor-pointer' >
                            <span onClick={() => handleApprovePost(post._id, post.author.username)} className='btn btn-xs text-white bg-[#308853] lg:hover:bg-[#0f361f]'> Approve</span>
                        </div>
                        <div className='flex flex-col items-center'>
                            <span onClick={() => handleDeclinePost(post._id, post.author.username)} className='btn btn-xs text-white bg-red-600 lg:hover:bg-red-900'> Decline</span>
                        </div>
                    </div>
                </div>
            ))}

            {isValidating && (data[size - 1]?.length != undefined || data[size - 1]?.length != 0) && <div>
                <LoadinginPenginPosts />
            </div>}
            {size > 0 && !isValidating && (data && (data[size - 1]?.length == undefined || data[size - 1]?.length === 0)) && <div className='py-1 text-center'>
                No more posts
            </div>}
            {/* {size > 0 && posts[posts.length - 1].length < pageSize && (
            <div>No more posts</div>
        )} */}
            {/* Infinite scrolling trigger */}
            <div ref={infiniteScrollRef} style={{ height: '10px' }} />
        </div>
    );
};

export default PendingPost;