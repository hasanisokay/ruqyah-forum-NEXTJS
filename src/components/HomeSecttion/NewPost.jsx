"use client"
import { useContext, useState } from "react";
import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import TextareaAutosize from 'react-textarea-autosize';
const NewPost = () => {
    const { fetchedUser, loading } = useContext(AuthContext);
    const [newPostData, setNewPostData] = useState("");
    const [loadingNewPost, setLoadingNewPost] = useState(false);
    const handleNewPostForm = async (e) => {
        e.preventDefault()
        if (newPostData === "") {
            return;
        }
        const newPost = {
            post: newPostData,
            date: new Date(),
            author: { username: fetchedUser.username },
            comment: [],
            likes: [],
            followers: []
        };
        if (fetchedUser.isAdmin) {
            newPost.status = "approved"
        }
        setLoadingNewPost(true)
        const toastId = toast.loading("Posting...");
        const { data } = await axios.post("/api/newpost", newPost)
        toast.dismiss(toastId)
        if (data?.status === 200) {
            toast.success(data.message)
            setNewPostData("");
        }
        else if (data?.status === 401) {
            toast.error(data.message)
        }
        setLoadingNewPost(false)
    };
    if (fetchedUser && loading === false && !fetchedUser?.blocked) {
        return (
            <div className="mb-4">
                <form
                    onSubmit={(e) => handleNewPostForm(e)}
                    className={`cardinhome ${loadingNewPost ? "opacity-40" : "opacity-100"}`}
                >
                    <TextareaAutosize
                        value={newPostData}
                        disabled={loadingNewPost}
                        maxRows={20}
                        onChange={(e) => setNewPostData(e.target.value)}
                        placeholder="Write your post"
                        className="textarea resize-none placeholder-shown:text-center bg-slate-200 dark:bg-[#3b3b3b] focus:outline-none w-full"
                    />
                    {
                       newPostData && <div className="text-center">
                            <button
                                title="Post"
                                disabled={loadingNewPost}
                                className={`forum-btn1 ${newPostData === ""
                                    ? "bg-slate-500 cursor-default"
                                    : "bg-[#308853] active:bg-[#0a4421] lg:hover:bg-[#0a4421]"
                                    }`}
                                type="submit"
                            >
                                Post
                            </button>
                        </div>
                    }
                </form>
            </div>
        );
    }
};

export default NewPost;
