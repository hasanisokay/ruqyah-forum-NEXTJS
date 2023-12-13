"use client"
import { useContext } from "react";
import Chat from "./Chat";
import AuthContext from "@/contexts/AuthContext";
import LoadingChat from "./LoadingChat";
import { useRouter } from "next/navigation";

const ChatProvider = () => {
    const router = useRouter
    const { loading, fetchedUser } = useContext(AuthContext);
    if (!loading && fetchedUser && fetchedUser?.isAdmin) return <Chat />
    if (loading && !fetchedUser) {
        return <LoadingChat />
    }
    else{
        router.push("/")
    }
};

export default ChatProvider;