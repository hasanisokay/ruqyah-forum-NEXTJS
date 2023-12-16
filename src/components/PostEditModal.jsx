import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

import TextareaAutosize from 'react-textarea-autosize';
const PostEditModal = ({ setterFunction, post, id, setPost }) => {
    const [editedText, setEditedText] = useState(post);
    const [loadingEditedPost, setLoadingEditedPost] = useState(false);
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if (editedText === post) {
            return toast.error("You didn't change anything.")
        }
        try {
            setLoadingEditedPost(true);
            const dataToSend = {
                editedText,
                previousText: post,
                id
            }
            const { data } = await axios.post(`/api/posts/editpost`, dataToSend);
            if (data.status === 200) {
                setPost((prev) => ({ ...prev, post: editedText }))
                setterFunction(false);
                toast.success(data.message);
            }
            else {
                toast.error(data.message)
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoadingEditedPost(false);
        }
    }
    return (
        <div>
            <dialog id="editModal" className="modal">
                <div className="modal-box">
                    <div className="absolute top-0 right-0">
                        <button title="close" onClick={() => setterFunction(false)} className="btn btn-sm btn-circle">x</button>
                    </div>
                    <p className="text-center">Edit your post</p>
                    <form onSubmit={e => handleFormSubmit(e)} disabled={loadingEditedPost}>
                        <TextareaAutosize
                            value={editedText}
                            disabled={loadingEditedPost}
                            maxRows={10}
                            onChange={(e) => setEditedText(e.target.value)}
                            placeholder='Edit your post'
                            className="pl-2 resize-none py-[10px] bg-slate-200 dark:bg-[#3b3b3b] pr-[44px] rounded-md placeholder:text-sm text-sm focus:outline-none w-full"
                        />
                        <div className="text-center">
                            {editedText !== post && <button type="submit" className="text-[10px] forum-btn1 bg-[#308853]">Submit edit</button>}
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default PostEditModal;