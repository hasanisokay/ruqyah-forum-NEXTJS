import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import getUser from "./getUser";
import toast from "react-hot-toast";


const AuthProvider = ({ children }) => {
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [allNotifications, setAllNotifications] = useState([]);
    const [loggedOut, setLoggedOut] = useState(false);
    const [fetchedUser, setFetchedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isReportingPost, setIsReportingPost] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportingCommentId, setReportingCommentId] = useState(null);
    const [reportingReplyId, setReportingReplyId] = useState(null);
    const [socket, setSocket] = useState(null)

    const signIn = async (username, password) => {
        const response = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        return data;
    }
    const logOut = async () => {
        setLoading(true);
        const { data } = await axios.get("/api/auth/logout")
        setFetchedUser(null)
        toast.success(data.message)
        setLoggedOut(true)
        setLoading(false);
    }

    useEffect(() => {
        (async () => {
            if (fetchedUser) {
                const userSocket = await io(`${process.env.NEXT_PUBLIC_server}/?userId=${fetchedUser?.username}`);
                setSocket(userSocket);
            } else {
                const anonymousSocket = await io(process.env.NEXT_PUBLIC_server);
                setSocket(anonymousSocket);
            }
        })();
    }, [fetchedUser]);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const { user } = await getUser();
            if (user.status === 200) {
                setLoggedOut(false);
                setFetchedUser(user.user);
                setLoading(false);
            }

            else {
                setFetchedUser(null)
                setLoading(false)
                return;
            }
        }
        fetchUser()
    }, [loggedOut])
    useEffect(() => {
        if (showDeleteModal) {
            document?.getElementById('deleteModal')?.showModal()
        }
    }, [showDeleteModal])

    useEffect(() => {
        if (showReportModal) {
            document.getElementById('reportModal')?.showModal()
        }
        if (!showReportModal) {
            setIsReportingPost(false)
            setReportingCommentId(null)
            document?.getElementById('reportModal')?.close();
        }
    }, [showReportModal])

    useEffect(() => {
        if (fetchedUser) {
            setNotificationsCount(fetchedUser?.unreadNotificationCount)
        }
    }, [fetchedUser])

    const value = {
        fetchedUser,
        setFetchedUser,
        signIn,
        logOut,
        loading,
        loggedOut,
        notificationsCount,
        setNotificationsCount,
        setAllNotifications,
        allNotifications,
        showDeleteModal,
        setShowDeleteModal,
        showReportModal,
        setShowReportModal,
        isReportingPost,
        setIsReportingPost,
        reportingCommentId,
        setReportingCommentId,
        reportingReplyId,
        setReportingReplyId,
        socket
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthProvider;