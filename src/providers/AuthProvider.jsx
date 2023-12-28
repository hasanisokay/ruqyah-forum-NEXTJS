import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
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
        const fetchUser = async () => {
            setLoading(true);
            const { user } = await getUser();
            if (user.status === 401) {
                setFetchedUser(null)
                setLoading(false)
                return;
            }
            setLoggedOut(false);
            setFetchedUser(user);
            setLoading(false);
        }
        fetchUser()
    }, [loggedOut])
    useEffect(() => {
        if (showDeleteModal) {
            document?.getElementById('deleteModal')?.showModal()
        }
    }, [showDeleteModal])

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
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthProvider;