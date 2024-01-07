'use client'
import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from 'react-textarea-autosize';
const Notice = () => {
    const { fetchedUser, loading } = useContext(AuthContext);
    const [newNoticeData, setNewNoticeData] = useState("");
    const [loadingNewNotice, setLoadingNewNotice] = useState(false);
    const [noticeTitle, setNoticeTitle] = useState("")
    const handleNewNoticeForm = async (e) => {
        e.preventDefault();
        if (newNoticeData === "" || noticeTitle ==="") {
            return toast.error("Write in both field.")
        }
        const newPost = {
            notice: newNoticeData,
            date: new Date(),
            title: noticeTitle,
            author: { username: fetchedUser.username },
        };
        setLoadingNewNotice(true)
        const toastId = toast.loading("Posting...");
        const { data } = await axios.post("/api/admin/notice", newPost)
        if (data?.status === 200) {
            toast.dismiss(toastId)
            toast.success(data.message)
            setNewNoticeData("");

        }
        else if (data?.status === 401) {
            toast.error(data.message)
        }
        setLoadingNewNotice(false)
    };
    if (fetchedUser) return (
        <div>
            <form
                onSubmit={handleNewNoticeForm}
                className={`cardinhome ${loadingNewNotice ? "opacity-40" : "opacity-100"}`}
            >
                <div className="text-center">
                    <input type="text" disabled={loadingNewNotice} value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} placeholder="Notice Title" className="input input-bordered focus:outline-none w-full my-4 md:max-w-[50%] max-w-[95%]" />
                </div>
                <TextareaAutosize
                    value={newNoticeData}
                    disabled={loadingNewNotice}
                    maxRows={20}
                    onChange={(e) => setNewNoticeData(e.target.value)}
                    placeholder="Write your notice"
                    className="textarea resize-none border-2 focus:outline-none border-gray-400 focus:border-blue-700 bordered w-full"
                />
                <div className="text-center mt-2">
                    <button
                        title="Post"
                        disabled={loadingNewNotice}
                        className={`forum-btn1 ${newNoticeData === ""
                            ? "bg-slate-500 cursor-default"
                            : "bg-[#308853] active:bg-[#0a4421] lg:hover:bg-[#0a4421]"
                            }`}
                        type="submit"
                    >
                        Send New Notice
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Notice;