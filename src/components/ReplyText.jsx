import { BsDot } from "react-icons/bs";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/contexts/AuthContext";

const ReplyText = ({ text, replyID, commentID, postID, setFetchedReplies, setReplyCount }) => {
    const { showDeleteModal, setShowDeleteModal } = useContext(AuthContext);
    const [showReplyOptions, setShowReplyOptions] = useState(false);
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
    return (
        <div>
            <div onClick={() => setShowReplyOptions(!showReplyOptions)} className="relative cursor-pointer">
                <div className="absolute top-0 -right-4">
                    <BsDot />
                </div>
            </div>
            <div className={`relative ${replyID}`}>
                {
                    showReplyOptions && <div className="absolute text-sm right-0 z-10 top-2 mt-2 p-1 w-[150px] shadow-xl rounded-md bg-white dark:bg-[#1c1c1c]" >
                        <button className="lg:hover:bg-[#308853] px-2 py-1 rounded-md lg:hover:text-white w-full duration-300 text-left">Edit</button>
                        <button onClick={() => setShowDeleteModal(true)} className="lg:hover:bg-red-700 duration-300 w-full px-2 py-1 text-left rounded-md lg:hover:text-white">Delete</button>
                    </div>
                }
            </div>
            <p className='whitespace-pre-wrap text-[14px] py-[4px] '>{text}</p>
            {
                showDeleteModal && <DeleteConfirmationModal setterFunction={setShowDeleteModal} id={postID} replyID={replyID} commentID={commentID} setFetchedReplies={setFetchedReplies} setReplyCount={setReplyCount} />
            }
        </div>
    );
};

export default ReplyText;