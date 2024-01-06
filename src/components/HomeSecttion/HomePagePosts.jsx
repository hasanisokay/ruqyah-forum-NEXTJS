'use client'
import formatRelativeDate from '@/utils/formatDate';
import { BsThreeDotsVertical } from "react-icons/bs";
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
import toast from 'react-hot-toast';
import ModalUser from '../ModalUser';
import LikersModal from '../LikersModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import PhotosInPost from '../PhotosInPost';
import VideosInPost from '../video-components/VideosInPost';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import Link from 'next/link';
import copyToClipboard from '@/utils/copyToClipboard';
import ReportModal from '../ReportModal';

const fetcher = (url) => fetch(url).then((res) => res.json());

const HomePagePosts = () => {
    const { fetchedUser, showDeleteModal, setShowDeleteModal, showReportModal, setShowReportModal } = useContext(AuthContext);
    const infiniteScrollRef = useRef();
    const [selectedPostIdForOptions, setSelectedPostIdForOptions] = useState(null);
    const [expandedPosts, setExpandedPosts] = useState([]);
    const [selectedUsernameToShowDetails, setSelectedUsernameToShowDetails] = useState(null)
    const [likersArray, setLikersArray] = useState(null);
    const [postIdToReport, setPostIdToReport] = useState(null);
    const [postIdToDelete, setPostIdToDelete] = useState(null)
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.length === 0) return null;
        return `/api/posts?page=${pageIndex + 1}`;
    };

    const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);

    // const posts = data ? data.flat() : [];
    const [posts, setPosts] = useState(data ? data.flat() : []);
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

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                selectedPostIdForOptions &&
                !event.target.closest('.relative') &&
                event.target !== infiniteScrollRef.current
            ) {
                // Clicked outside the options, hide them
                setSelectedPostIdForOptions(null);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [selectedPostIdForOptions]);

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

    const handleShowUser = (username) => {
        setSelectedUsernameToShowDetails(username);
    }

    useEffect(() => {
        if (selectedUsernameToShowDetails) {
            document.getElementById('userModal').showModal();
        }
    }, [selectedUsernameToShowDetails]);

    useEffect(() => {
        if (likersArray) {
            document.getElementById('likerModal').click();
        }
    }, [likersArray]);

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
    const handleReport = (id) => {
        setPostIdToReport(id);
        setShowReportModal(true)
    }
    const handleLike = async (id, postAuthor) => {
        if (!fetchedUser) {
            return toast.error("Log in to react")
        }
        const dataToSend = {
            postID: id, action: "like", actionByUsername: fetchedUser?.username, postAuthor
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
    const handleDelete = (id) => {
        setPostIdToDelete(id);
        setShowDeleteModal(true)
    }
    return (
        <div>
            {posts?.map((post) => (
                <div key={post._id} className='cursor-default bg-[#fffef9] shadow-xl dark:bg-[#242526] mx-2 mb-4 rounded-lg cardinhome min-h-[10vh]'>
                    <div className='p-2'>
                        <div className='relative'>
                            <BsThreeDotsVertical onClick={() => setSelectedPostIdForOptions(post?._id)} className='absolute right-0 cursor-pointer' />
                            {selectedPostIdForOptions === post?._id && (
                                <div className='z-10 absolute text-center text-sm right-0 top-2 mt-2 p-1 max-w-[200px] min-w-[150px] shadow-xl rounded-md  bg-[#f3f2f0] dark:bg-[#1c1c1c]'>
                                    <div className='flex flex-col gap-2 dark:text-white text-black '>
                                        <button className='forum-btn2 lg:hover:bg-slate-500' onClick={() => copyToClipboard(`https://forum.ruqyahbd.org/${post._id}`)}>Copy link</button>
                                        {fetchedUser && <button onClick={() => handleReport(post?._id)} className='forum-btn2 lg:hover:bg-slate-500'>Report</button>}
                                        {(post?.authorInfo?.username === fetchedUser?.username || fetchedUser?.isAdmin) && <button onClick={() => handleDelete(post?._id)} className='lg:hover:bg-red-500 forum-btn2'>Delete</button>}

                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='flex gap-2 items-center'>
                            <div onClick={() => handleShowUser(post?.authorInfo?.username)} className='cursor-pointer'>
                                {
                                    post?.authorInfo?.photoURL ?
                                        <Image src={post?.authorInfo?.photoURL} alt='User Profile Photo'
                                            width={30} 
                                            height={30} 
                                            priority={true}
                                            quality={100}
                                            className='w-[45px] h-[45px] rounded-full border-gray-400 border-2'
                                            sizes="10vw"
                                        />
                                        : <div className='flex items-center justify-center rounded-full border-gray-400 border-2 w-[45px] h-[45px]'><FaUserLarge className='' /></div>
                                }
                            </div>
                            <div className='py-2'>
                                <p onClick={() => handleShowUser(post?.authorInfo?.username)} className='cursor-pointer font-semibold'>{post?.authorInfo?.name}</p>
                                <div className='text-xs flex gap-2 items-center'>
                                    <p>@{post?.authorInfo?.username}</p>
                                    <p title={formatDateInAdmin(new Date(post?.date))}> <Link className='hover:underline' href={`/${post?._id}`}>{formatRelativeDate(new Date(post?.date))}</Link></p>
                                </div>
                                {
                                    fetchedUser?.isAdmin && <div>
                                        <p className='text-[10px]'> <span>{post?.authorInfo?.isAdmin ? "Admin" : "Member"} since</span> {formatDateForUserJoined(new Date(post?.authorInfo?.joined))}</p>
                                    </div>
                                }
                            </div>
                        </div>
                        <p className='whitespace-pre-wrap break-words'>{expandedPosts.includes(post._id) ? post?.post : truncateText(post?.post)}
                            {!expandedPosts.includes(post._id) && post?.post?.length > 200 && (
                                <button onClick={() => handleToggleExpand(post._id)} className='text-[10px] font-semibold'>... Show more</button>
                            )}
                            {expandedPosts.includes(post._id) && (
                                <button onClick={() => handleShowLess(post._id)} className='text-[10px] font-semibold pl-1'>Show less </button>
                            )}
                        </p>
                    </div>
                    <div className=''>
                        {
                            post?.videos && post?.videos?.length > 0 && <div>
                                <VideosInPost videosArray={post?.videos} />
                            </div>
                        }
                        {post?.photos && post?.photos?.length > 0 && <div className={`${post?.videos?.length > 0 && ""}`}>
                            <PhotosInPost
                                photosArray={post?.photos}
                            />
                        </div>}
                    </div>
                    <div className='flex items-center p-2 gap-6 mt-2'>
                        <div>
                            <Link href={`/${post?._id}`} className='flex items-center flex-col'>
                                <FaRegComment className='' />
                                <span className='text-xs'>{post?.comment || 0} Comments</span>
                            </Link>
                        </div>
                        <div className='flex flex-col items-center'>
                            {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ? <FaHeart title='You Liked this. Click to dislike' onClick={() => handleDislike(post._id)} className=' text-red-600 cursor-pointer' /> : <FaRegHeart title='Click to Like' onClick={() => handleLike(post._id, post?.authorInfo?.username)} className='cursor-pointer' />}
                            <span className='text-xs cursor-pointer' onClick={() => setLikersArray(post?.likes)}>{post?.likes?.length || 0} Likes</span>
                        </div>
                    </div>
                    {
                        showDeleteModal && <DeleteConfirmationModal id={postIdToDelete} isAuthorized={fetchedUser?.isAdmin || fetchedUser?.username === post?.authorInfo?.username} setterFunction={setShowDeleteModal} />
                    }
                    {likersArray && <LikersModal usernames={likersArray} setterFunction={setLikersArray} />}
                    {selectedUsernameToShowDetails && <ModalUser username={selectedUsernameToShowDetails} setterFunction={setSelectedUsernameToShowDetails} />}
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
            {
                showReportModal && <ReportModal postID={postIdToReport} key={postIdToReport} type={"post"} />
            }
        </div>
    );
};

export default HomePagePosts;

