'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import formatDateInAdmin from "@/utils/formatDateInAdmin";
import Image from "next/image";
import { FaUserLarge } from "react-icons/fa6";
import LoadingModalUser from "./LoadingModal";
import ReplyText from "./ReplyText";
import { useSearchParams } from "next/navigation";

const Replies = ({ postID, commentID, setReplyCount, handleShowUser, replyCount, socket }) => {
    const pageRef = useRef(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [fetchedReplies, setFetchedReplies] = useState([]);
    const [scrolledToReply, setScrolledToReply] = useState(false);
    const searchParams = useSearchParams();
    const replyIDFromParams = searchParams.get('replyID');
    useEffect(() => {
        if (replyIDFromParams?.length > 2 && fetchedReplies?.length > 0 && !scrolledToReply) {
            const targetReply = document.getElementById(`${replyIDFromParams}`);
            if (targetReply) {
                try {
                    targetReply.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
                    targetReply.classList.add("highlightedClass");
                    setTimeout(() => {
                        targetReply.classList.remove("highlightedClass");
                        setScrolledToReply(true);
                    }, 3000);
                }
                catch {

                }
            }
        }
    }, [replyIDFromParams, fetchedReplies]);




    const handleLoadMore = () => {
        pageRef.current += 1;
    };

    const fetchReplies = useCallback(async () => {
        if (replyCount === 0) return;
        if (fetchedReplies?.length > 1 && fetchedReplies?.length < 10) return;

        if (fetchedReplies?.length === replyCount) return;
        try {
            setLoading(true);
            const url = `/api/getreplies?commentID=${commentID}&postID=${postID}&page=${pageRef.current}`;
            const response = await fetch(url);
            const data = await response.json();
            const newReplies = data?.replies || [];
            if (newReplies?.length === 0) {
                setHasMore(false);
            }
            setFetchedReplies((prevReplies) => [...prevReplies, ...newReplies]);
        } catch (error) {
            console.error("Error fetching replies:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await fetchReplies();
        })()
    }, [fetchReplies]);

    useEffect(() => {
        if (socket) {
            socket.on('newReply', (reply) => {
                if (reply.postID === postID && reply.commentID === commentID) {
                    delete reply.commentID
                    setFetchedReplies((prevReplies) => [...prevReplies, reply]);
                    setReplyCount((prev) => prev + 1);
                }
            });
        }
        return () => {
            if (socket) {
                socket.off('newReply');
            }
        };
    }, [postID, commentID, socket, setReplyCount]);


    return (
        <div>

            {hasMore && !loading && replyCount > fetchedReplies?.length && <div className="text-center">
                <button className="text-[10px]" onClick={handleLoadMore} disabled={loading}>
                    Load More
                </button>
            </div>}
            {
                loading && <LoadingModalUser />
            }
            {fetchedReplies.map((reply, index) => (
                <div key={index} className="mb-[10px]">
                    <div className="flex gap-2 ">
                        <div onClick={() => handleShowUser(reply?.authorInfo?.username)} className='cursor-pointer min-w-[20px]'>
                            {
                                reply?.authorInfo?.photoURL ?
                                    <Image src={reply.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
                                        width={20} height={20} priority={true}
                                        className='border-gray-400 rounded-full border-2 w-[20px] h-[20px]'
                                    />
                                    : <div className='flex items-center justify-center rounded-full border-gray-400 border-2 w-[20px] h-[20px]'><FaUserLarge className='w-full h-full' /></div>
                            }
                        </div>
                        <div id={reply?._id} className='bg-gray-200 dark:bg-[#3a3b3c] px-4 py-1 rounded-xl max-w-full min-w-[200px]'>
                            <p><span className=''> <span onClick={() => handleShowUser(reply?.authorInfo?.username)} className='text-[14px] font-semibold cursor-pointer'>{reply?.authorInfo?.name}</span> </span>
                            </p>
                            <div className='text-xs flex gap-2 items-center'>
                                <p className=''>@{reply?.authorInfo?.username}</p>
                                <p className='text-[10px]' title={reply?.date}> {formatDateInAdmin(new Date(reply?.date) || new Date())}</p>
                            </div>
                            <ReplyText
                                key={reply?._id}
                                commentID={commentID}
                                replyID={reply?._id}
                                postID={postID}
                                text={reply?.reply}
                                replyAuthor={reply?.authorInfo?.username}
                                setFetchedReplies={setFetchedReplies}
                                setReplyCount={setReplyCount}
                            />
                            {/* <p className='whitespace-pre-wrap text-[14px] py-[4px] '>{reply.reply}</p> */}
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default Replies;