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
        };
        if(fetchedUser.isAdmin){
            newPost.status = "approved"
        }
        setLoadingNewPost(true)
        const toastId = toast.loading("Posting...");
        const { data } = await axios.post("api/newpost", newPost)
        if (data?.status === 200) {
            toast.dismiss(toastId)
            toast.success(data.message)
            setNewPostData("");

        }
        else if (data?.status === 401) {
            toast.success(data.message)
        }
        setLoadingNewPost(false)
    };
    if (fetchedUser && loading === false) {
        return (
            <div>
                <form
                    onSubmit={(e)=>handleNewPostForm(e)}
                    className={`cardinhome ${loadingNewPost ? "opacity-40" : "opacity-100"}`}
                >
                    <TextareaAutosize
                        value={newPostData}
                        disabled={loadingNewPost}
                        maxRows={20}
                        onChange={(e) => setNewPostData(e.target.value)}
                        placeholder="Write your post"
                        className="textarea border-2 focus:outline-none border-gray-400 focus:border-blue-700 bordered w-full"
                    />
                    <div className="text-center mt-2">
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
                </form>
            </div>
        );
    }
};

export default NewPost;
