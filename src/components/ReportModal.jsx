"use client"

import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const ReportModal = ({ type, postID, commentID, replyID }) => {
    const { setShowReportModal, fetchedUser, socket } = useContext(AuthContext);
    const [reportReason, setReportReason] = useState("");
    const [error, setError] = useState("");
    const [loadingReport, setLoadingReport] = useState(false);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setShowReportModal(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [setShowReportModal]);
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!reportReason.trim()) {
            setError("Please provide a reason.");
            return;
        }
        const toastID = toast.loading("Submitting...")
        const dataToSend = {
            reason: reportReason,
            reportBY: fetchedUser?.username,
            date: new Date(),
            postID,
            commentID,
            replyID,
            type
        }
        const { data } = await axios.post("/api/newreport", dataToSend)

        toast.dismiss(toastID)
        toast.success(data?.message || "success");
        const newCommentNotification = {
            author: {
                username: fetchedUser?.username,
                name: fetchedUser?.name,
                photoURL: fetchedUser?.photoURL,

            },
            commentAuthor: [{ username: fetchedUser.username }],
            postAuthor: [{ username: "" }],
            date: dataToSend?.date,
            postID,
            commentID,
            replyID,
            type: "report",
            content: type
        }

        console.log(socket);
        if (socket) {
            socket.emit("newReport", { newCommentNotification });
        }
        setShowReportModal(false);
    };
    return (
        <div>
            <dialog id="reportModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Please, tell us the reason.</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-content">
                            <input
                                type="text"
                                id="reportReason"
                                name="reportReason"
                                placeholder="Write why you are reporting this."
                                value={reportReason}
                                onChange={(e) => {
                                    setReportReason(e.target.value);
                                    setError("");
                                }}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none"
                            />
                            {error && <p className="text-red-500">{error}</p>}
                        </div>

                        <div className="modal-action">
                            <button type="button" onClick={() => setShowReportModal(false)} className="px-2 py-1 rounded-md bg-slate-300 text-black text-xs">
                                Close
                            </button>
                            <button type="submit" className="px-2 py-1 rounded-md text-black  text-xs bg-[#88ee8d]">
                                Submit Report
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ReportModal;