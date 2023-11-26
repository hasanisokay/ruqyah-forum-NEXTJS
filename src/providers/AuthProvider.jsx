import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import getUser from "./getUser";
import toast from "react-hot-toast";


const AuthProvider = ({ children }) => {
    const [loggedOut, setLoggedOut] = useState(false)
    const [fetchedUser, setFetchedUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const signIn = async (username, password) => {
        const response = await fetch(`api/auth/login`, {
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
        const {data} = await axios.post("api/auth/logout")
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
    const value = {
        fetchedUser,
        setFetchedUser,
        signIn,
        logOut,
        loading,
        loggedOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// export { getServerSideProps };
export default AuthProvider;