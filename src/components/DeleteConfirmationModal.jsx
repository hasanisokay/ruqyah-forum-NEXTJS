'use client'
import handleDeleteComment from "@/utils/handleDeleteComment";
import handleDeletePost from "@/utils/handleDeletePost";
import handleDeleteReply from "@/utils/handleDeleteReply";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const DeleteConfirmationModal = ({ id, isAuthorized, setterFunction, commentID, setPost, setFetchedReplies, setReplyCount, replyID }) => {

    const router = useRouter();
    const pathname = usePathname();


    const setConfirm = async (confirm) => {
        setterFunction(false);
        if (!confirm) {
            return toast.error("Canceled");
        }
        if (replyID) {
            const deleted = await handleDeleteReply(id, commentID, replyID);
            if (deleted) {
                setFetchedReplies((prev) => prev.filter((c) => c._id !== replyID));
                setReplyCount((prev) => prev - 1);
            }
        }
        else if (!replyID && commentID && id) {
            const deleted = await handleDeleteComment(id, commentID)
            if (deleted) {
                setPost((prev) => ({ ...prev, comment: [...prev?.comment?.filter(c => c._id !== commentID)] }))
            }
        }
        else if (!commentID && !replyID && id) {
            await handleDeletePost(id, isAuthorized);
            if (pathname !== "/") {
                router?.push("/")
            }
        }
    }
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setterFunction(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [setterFunction]);

    return (
        <div>
            <dialog id="deleteModal" className="modal">
                <div className="modal-box">
                    <p className="text-center font-semibold">Sure to do this?</p>
                    <div className="flex gap-2 justify-center items-center">
                        <button className="forum-btn1 bg-red-600" onClick={() => setConfirm(true)}>Hit it</button>
                        <button className="forum-btn1 bg-[#308853]" onClick={() => setConfirm(false)}>No, changed my mind</button>

                    </div>
                </div>
                <form method="dialog" className="modal-backdrop cursor-default">
                    <button className="cursor-default" onClick={() => setterFunction(false)}></button>
                </form>
            </dialog>
        </div>
    );
};

export default DeleteConfirmationModal;
