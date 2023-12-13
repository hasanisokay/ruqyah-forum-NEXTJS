import { useState, useEffect } from "react";
import axios from "axios";
import formatDateInAdmin from "@/utils/formatDateInAdmin";
import Image from "next/image";
import { FaUserLarge } from "react-icons/fa6";
import LoadingModalUser from "./LoadingModal";
const Replies = ({ postID, commentID, fetchedReplies, setFetchedReplies, handleShowUser, replyCount }) => {
    
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const fetchReplies = async () => {
        if(replyCount ===0)return
        try {
            setLoading(true);

            const { data } = await axios.get(`/api/getreplies?commentID=${commentID}&postID=${postID}&page=${page}`);
            const newReplies = data.replies || [];
            if (newReplies.length === 0) {
                setHasMore(false);
            }
            if (fetchedReplies?.length > 1 && fetchedReplies?.length < 10) {
                return
            }
            setFetchedReplies((prevReplies) => [...prevReplies, ...newReplies]);
        } catch (error) {
            console.error("Error fetching replies:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (page === 1 && fetchedReplies?.length === 0) {
            fetchReplies();
        }
    }, []);
    useEffect(() => {
        if (fetchedReplies?.length !== 0 && page > 1) {
            fetchReplies();
        }
    }, [page]);

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <div>

            {hasMore && !loading && replyCount > fetchedReplies?.length && <div className="text-center">
                <button className="text-[10px]" onClick={handleLoadMore} disabled={loading}>
                    Load More
                </button>
            </div>}
            {
                loading && <LoadingModalUser/>
            }
            {fetchedReplies.map((reply, index) => (
                <div key={index} className="mb-[10px]">
                    <div className="flex gap-2 ">
                        <div onClick={() => handleShowUser(reply?.authorInfo?.username)} className='cursor-pointer min-w-[20px]'>
                            {
                                reply?.authorInfo?.photoURL ?
                                    <Image src={reply.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
                                        width={20} height={20} loading='lazy'
                                        className='border-gray-400 rounded-full border-2 w-[20px] h-[20px]'
                                    />
                                    : <div className='flex items-center justify-center rounded-full border-gray-400 border-2 w-[20px] h-[20px]'><FaUserLarge className='' /></div>
                            }
                        </div>
                        <div className='bg-gray-200 dark:bg-[#3a3b3c] px-4 py-1 rounded-xl max-w-full min-w-[200px]'>
                            <p><span className=''> <span onClick={() => handleShowUser(reply?.authorInfo?.username)} className='text-[14px] font-semibold cursor-pointer'>{reply?.authorInfo?.name}</span> </span>
                            </p>
                            <div className='text-xs flex gap-2 items-center'>
                                <p className=''>@{reply?.authorInfo?.username}</p>
                                <p className='text-[10px]' title={reply?.date}> {formatDateInAdmin(new Date(reply?.date) || new Date())}</p>
                            </div>
                            <p className='whitespace-pre-wrap text-[14px] py-[4px] '>{reply.reply}</p>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default Replies;