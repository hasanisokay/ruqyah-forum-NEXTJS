'use client'
import { BsDot } from "react-icons/bs";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/contexts/AuthContext";
import ReplyEditModal from "./ReplyEditModal";
import ReportModal from "./ReportModal";

const ReplyText = ({ text, replyID, commentID, postID, setFetchedReplies, setReplyCount, replyAuthor }) => {
    const { showDeleteModal, setShowDeleteModal, fetchedUser, reportingReplyId, setReportingReplyId, reportingCommentId, setReportingCommentId, showReportModal, setShowReportModal } = useContext(AuthContext);
    const [showReplyOptions, setShowReplyOptions] = useState(false);
    const [showEditReplyModal, setShowEditReplyModal] = useState(false);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (showReplyOptions &&
                !event?.target?.closet?.(`div`)?.querySelector(`.${replyID}`)) {
                setShowReplyOptions(false);
            }
        }
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [showReplyOptions, replyID])

    useEffect(() => {
        if (showEditReplyModal) {
            document?.getElementById('replyEditModal')?.showModal()
        }
        if (!showEditReplyModal) {
            document?.getElementById('replyEditModal')?.close()
        }
    }, [showEditReplyModal])
    const handleReport = () => {
        setReportingReplyId(replyID)
        setReportingCommentId(commentID)
        setShowReportModal(true);
    }
    return (
        <div>
            {fetchedUser && <div onClick={() => setShowReplyOptions(!showReplyOptions)} className="relative cursor-pointer">
                <div className="absolute top-0 -right-4">
                    <BsDot />
                </div>
            </div>}
            <div className={`relative ${replyID}`}>
                {
                    showReplyOptions && fetchedUser && <div className="absolute text-sm right-0 z-10 top-2 mt-2 p-1 w-[150px] shadow-xl rounded-md bg-white dark:bg-[#1c1c1c]" >
                        {fetchedUser && fetchedUser?.username === replyAuthor && <button onClick={() => setShowEditReplyModal(true)} className="forum-btn2 lg:hover:bg-slate-500">Edit</button>}
                        {fetchedUser && <button onClick={handleReport} className="forum-btn2 lg:hover:bg-slate-500">Report</button>}
                        {fetchedUser && (fetchedUser?.isAdmin || fetchedUser?.username === replyAuthor) && <button onClick={() => setShowDeleteModal(true)} className="lg:hover:bg-red-700 forum-btn2">Delete</button>}
                    </div>
                }
            </div>
            <p className='whitespace-pre-wrap text-[14px] py-[4px] '>{text}</p>
            {
                showReportModal && reportingCommentId && reportingReplyId && <ReportModal commentID={reportingCommentId} key={reportingReplyId} postID={postID} replyID={reportingReplyId} type={"reply"} />
            }
            {
                showDeleteModal && <DeleteConfirmationModal setterFunction={setShowDeleteModal} id={postID} replyID={replyID} commentID={commentID} setFetchedReplies={setFetchedReplies} setReplyCount={setReplyCount} />
            }
            {
                showEditReplyModal && <ReplyEditModal setFetchedReplies={setFetchedReplies} setterFunction={setShowEditReplyModal} reply={text} replyID={replyID} commentID={commentID} postID={postID} />
            }
        </div>
    );
};

export default ReplyText;