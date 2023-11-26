'use client'
import formatRelativeDate from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import React, { useRef, useCallback, useContext, useState, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import Image from 'next/image'
import { FaUserLarge, FaHeart } from "react-icons/fa6"
import AuthContext from '@/contexts/AuthContext';
import LoadingCards from '../LoadingCards';
import truncateText from '@/utils/trancatText';
import formatDateForUserJoined from '@/utils/formatDateForUserJoined';
import axios from 'axios';
import { mutate } from 'swr';
const fetcher = (url) => fetch(url).then((res) => res.json());

const HomePagePosts = () => {
    const { fetchedUser } = useContext(AuthContext);
    const infiniteScrollRef = useRef();

    const [expandedPosts, setExpandedPosts] = useState([]);
    const router = useRouter();
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.length === 0) return null;
        return `/api/posts?page=${pageIndex + 1}`;
    };

    const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);

    // const posts = data ? data.flat() : [];
    const [posts, setPosts] = useState(data ? data.flat() : []);
    const pageSize = 10;
    useEffect(() => {
        setPosts(data?.flat())
    }, [data])
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
        <LoadingCards />
        <LoadingCards />
        <LoadingCards />
    </div>
    const handleDislike = async (id) => {
        if (!fetchedUser) {
            return toast.error("Log in to react")
        }
        const dataToSend = {
            postID: id, action: "dislike", actionByUsername: fetchedUser?.username
        }
        try {
            const { data } = await axios.post("/api/posts/reaction", dataToSend);

            if (data.status === 200) {
                // Update the likes array in the posts
                const updatedPosts = posts.map((post) => {
                    if (post._id === id) {
                        // Remove fetchedUser.username from the likes array
                        post.likes = post.likes.filter((person) => person !== fetchedUser.username);
                    }
                    return post;
                });

                // Update the state to trigger a re-render
                setPosts(updatedPosts);
            }
        } catch (error) {
            console.error("Error disliking post:", error);
        }
    }
    const hanldleLike = async (id) => {
        if (!fetchedUser) {
            return toast.error("Log in to react")
        }
        const dataToSend = {
            postID: id, action: "like", actionByUsername: fetchedUser?.username
        }
        try {
            const { data } = await axios.post("/api/posts/reaction", dataToSend);
            if (data.status === 200) {
                const updatedPosts = posts.map((post) => {
                    if (post._id === id) {
                        if (post?.likes?.length > 0) {
                            post.likes = [...post.likes, fetchedUser.username]
                        }
                        else {
                            post.likes = [fetchedUser.username]
                        }
                    }
                    return post;
                });
                setPosts(updatedPosts)
            }
        } catch (error) {
            console.error("Error disliking post:", error);
        }
    }
    return (
        <div>
            {posts?.map((post) => (
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
                            <p className='font-semibold'>{post?.authorInfo?.name}</p>
                            <div className='text-xs flex gap-2 items-center'>
                                <p className=''>@{post?.authorInfo?.username}</p>
                                <p className='' title={post.date}> {formatRelativeDate(new Date(post.date))}</p>
                            </div>
                        </div>
                        <div>
                            <p className='text-xs'> <span>{post?.authorInfo?.isAdmin ? "Admin" : "Member"} since</span> {formatDateForUserJoined(new Date(post?.authorInfo?.joined))}</p>
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
                        <div className='flex items-center flex-col cursor-pointer' onClick={() => router.push(`/${post._id}`)}>
                            <FaRegComment className='' />
                            <span className='text-xs'>{post?.comment?.length || 0} Comments</span>
                        </div>
                        <div className='flex flex-col items-center'>
                            {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ? <FaHeart title='You Liked this. Click to dislike' onClick={() => handleDislike(post._id)} className=' text-red-600 cursor-pointer' /> : <FaRegHeart title='Click to Like' onClick={() => hanldleLike(post._id)} className='cursor-pointer' />}
                            <span className='text-xs'>{post?.likes?.length || 0} Likes</span>
                        </div>
                    </div>
                </div>
            ))}

            {isValidating && (data[size - 1]?.length != undefined || data[size - 1]?.length != 0) && <div>
                <LoadingCards />
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

export default HomePagePosts;

