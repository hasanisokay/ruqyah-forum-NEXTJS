
'use client'
import { useRouter } from 'next/navigation';
import React, { useRef, useCallback, useContext, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Image from 'next/image'
import { FaUserLarge } from "react-icons/fa6"
import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import LoadinginAdminActivity from './LoadingAdminActivity';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
const fetcher = (url) => fetch(url).then((res) => res.json());
const AdminActivity = () => {
    const { fetchedUser } = useContext(AuthContext);
    const [actionFilter, setActionFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order is descending
    const [searchTerm, setSearchTerm] = useState('');
    const [searchText, setSearchText] = useState('');
    const [postTextForModal, setPostTextForModal] = useState("")
    const handleModal = (text) => {
        setPostTextForModal(text)
        document.getElementById('my_modal_2').showModal()
    }
    const infiniteScrollRef = useRef();
    const router = useRouter();
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.length === 0) return null;
        return `/api/admin/adminactivity?page=${pageIndex + 1}`;
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
            params.append('actionFilter', actionFilter);
            return `/api/admin/adminactivity?${params.toString()}`;
        },
        fetcher
    );
    const posts = data ? data.flat() : [];
    const pageSize = 10;

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
        <LoadinginAdminActivity />
    </div>
    const handleApprovePost = async (adminUsername, postID, postAuthorUsername, updateActivityLogID) => {
        const dataToSend = { actionBy: adminUsername, postAuthorUsername, postID, action: "approve", updateActivityLogID }
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
    const sortedPosts = posts.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const filteredPosts = searchTerm
        ? sortedPosts.filter((post) =>
            post?.approvedBy?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
            post?.declinedBy?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
            post?.postAuthorUsername?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        )
        : sortedPosts;
console.log(posts);
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
                <select
                    id="actionFilter"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="mr-4"
                >
                    <option value="">All Actions</option>
                    <option value="approve">Approved</option>
                    <option value="decline">Declined</option>
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
            {posts.map((post) => (
                <div key={post._id} className='p-2 cursor-default border-2 m-2 rounded-lg dark:border-gray-400 cardinhome '>
                    <div className='flex gap-2 items-center'>
                        <div>
                            {
                                post?.authorInfo.photoURL ?
                                    <Image src={post?.authorInfo.photoURL} blurDataURL='' alt='User Profile Photo'
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
                            <p className={`font-semibold ${post.action === "approve" ? "text-[#308853]" : "text-red-600"}`}><span className='capitalize'>{post?.action}</span>d</p>
                            <p className='font-semibold'>Author: {post?.authorInfo.name}</p>
                            <p className='font-semibold'>Author Username : {post?.postAuthorUsername}</p>
                            {
                                post?.approvedBy && <p className='font-semibold'> Approved by: {post?.approvedBy}</p>
                            }
                            {
                                post?.declinedBy && <p className='font-semibold'>Declined by: {post?.declinedBy}</p>
                            }
                            {
                                post?.declinedBy && <div className='flex gap-4'>
                                    <button className='btn btn-xs text-white bg-[#308853]' onClick={() => handleModal(post?.post)}>See Post</button>
                                    <button className='btn btn-xs text-white bg-[#308853]' onClick={() => handleApprovePost(fetchedUser?.username, post.postID, post?.author?.username, post._id)}>Approve</button>
                                </div>
                            }
                          
                            <dialog id="my_modal_2" className="modal">
                                <div className="modal-box">
                                    <h3 className="whitespace-pre-wrap">{postTextForModal}</h3>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>
                            <p className='font-semibold'>Action Date: {formatDateInAdmin(new Date(post?.timestamp))}</p>
                            {
                                post?.postID && post?.action ==="approve" && <button className='btn btn-xs btn-warning' onClick={() => router.push(`/${post.postID}`)}>Go to post</button> 
                            }
                        </div>
                    </div>
                </div>
            ))}

            {isValidating && (data[size - 1]?.length != undefined || data[size - 1]?.length != 0) && <div>
                <LoadinginAdminActivity />
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

export default AdminActivity;
