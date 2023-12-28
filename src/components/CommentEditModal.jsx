import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from 'react-textarea-autosize';

const CommentEditModal = ({ commentID, comment, postID, setterFunction, setPost }) => {

    const [newComment, setNewComment] = useState(comment);
    const [loadingComment, setLoadingComment] = useState(false);

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
        if (comment && newComment === comment) {
            return toast.error("Make some changes to update comment.");
        }
        setLoadingComment(true);
        const toastID = toast.loading("Editing...");
        const { data } = await axios.post("/api/posts/editcomment", { commentID, newComment, postID })
        toast.dismiss(toastID);
        setLoadingComment(false);

        if (data?.status === 200) {
            toast.success(data?.message)
            setPost((prevPost) => {
                const updatedPost = {
                    ...prevPost,
                    comment: prevPost?.comment?.map((c) =>
                        c._id === commentID
                            ? { ...c, comment: newComment }
                            : c
                    ),
                };
                return updatedPost;
            });
            setterFunction(false);
        }
        else {
            toast.error(data?.message)
        }

    }
    return (
        <div>
            <dialog id="commentEditModal" className="modal">
                <div className="modal-box">
                    <div className="text-right">
                        <button onClick={() => setterFunction(false)} className="btn btn-circle btn-sm text-red-600">X</button>
                    </div>
                    <h3 className="font-semibold text-center">Edit Comment</h3>
                    <div>
                        <form
                            onSubmit={(e) => handleSubmit(e)}
                            className={`${loadingComment ? "opacity-40" : "opacity-100"}`}
                        >
                            <TextareaAutosize
                                value={newComment}
                                disabled={loadingComment}
                                maxRows={20}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={comment}
                                className="textarea resize-none placeholder-shown:text-center bg-slate-200 dark:bg-[#3b3b3b] focus:outline-none w-full"
                            />
                            {
                                <div className="text-center">
                                    <button
                                        title="submit"
                                        disabled={loadingComment}
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

export default CommentEditModal;