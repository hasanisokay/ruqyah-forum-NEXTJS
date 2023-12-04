'use client'
import LoadingCards from "@/components/LoadingCards";
import PostShowingFormat from "@/components/PostShowingFormat";
import AuthContext from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const ProfilePosts = () => {
    const router = useRouter();
    const search = useSearchParams();
    const from = search.get("redirectUrl") || "/login?redirectUrl=profile/posts";
    const [loadingProfilePosts, setLoadingProfilePosts] = useState(false);
    const { fetchedUser, loading } = useContext(AuthContext);
    const [postsByUser, setPostsByUser] = useState([]);

    useEffect(() => {
        if (!loading && !fetchedUser) {
            router.replace(from)
        }
        if (fetchedUser) {
            const getData = async () => {
                setLoadingProfilePosts(true);
                const res = await fetch(`/api/userdetails?allpostby=${fetchedUser?.username}`);
                const data = await res?.json();
                setPostsByUser(data?.posts);
                setLoadingProfilePosts(false);
            };
            getData();
        }

    }, [loading, router, fetchedUser, from])

    if (loadingProfilePosts) {
        return <LoadingCards />
    }

    if (fetchedUser) return (
        <div>
            {
                postsByUser?.map((post) => <PostShowingFormat fetchedUser={fetchedUser} key={post._id} post={post} />)
            }
        </div>
    );
};

export default ProfilePosts;