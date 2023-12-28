import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from 'react-textarea-autosize';

const ReplyEditModal = ({ commentID, replyID, reply, postID, setterFunction, setFetchedReplies }) => {
    const [newReply, setNewReply] = useState(reply);
    const [loadingReply, setLoadingReply] = useState(false);
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
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (reply && newReply === reply) {
            return toast.error("Make some changes to update reply.")
        }

        setLoadingReply(true);
        const toastID = toast.loading("Editing...");
        const { data } = await axios.post("/api/posts/editcomment", { commentID, replyID, newReply, postID })
        toast.dismiss(toastID);
        setLoadingReply(false);

        if (data?.status === 200) {
            toast.success(data?.message)
            setFetchedReplies((prevReplies) => {
                const updatedReplies = prevReplies.map((r) =>
                    r._id === replyID ? { ...r, reply: newReply } : r
                );
                return updatedReplies;
            });
            setterFunction(false);
        }
        else {
            toast.error(data?.message)
        }
    }
    return (
        <div>
            <dialog id="replyEditModal" className="modal">
                <div className="modal-box">
                    <div className="text-right">
                        <button onClick={() => setterFunction(false)} className="btn btn-circle btn-sm text-red-600">X</button>

                    </div>
                    <h3 className="font-semibold text-center">Edit Reply</h3>
                    <div>
                        <form
                            onSubmit={(e) => handleSubmit(e)}
                            className={`${loadingReply ? "opacity-40" : "opacity-100"}`}
                        >
                            <TextareaAutosize
                                value={ newReply}
                                disabled={loadingReply}
                                maxRows={20}
                                onChange={(e) =>setNewReply(e.target.value) }
                                placeholder={reply}
                                className="textarea resize-none placeholder-shown:text-center bg-slate-200 dark:bg-[#3b3b3b] focus:outline-none w-full"
                            />
                            {
                                <div className="text-center">
                                    <button
                                        title="submit"
                                        disabled={loadingReply}
                                        className={`forum-btn1 bg-[#20693d] active:bg-[#0a4421] lg:hover:bg-[#0a4421] text-xs`}
                                        type="submit"
                                    >
                                        submit
                                    </button>
                                </div>
                            }
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ReplyEditModal;