'use client'
import LoadingProfile from "@/components/LoadingProfile";
import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProfileSecurity = () => {
    const router = useRouter();
    const { fetchedUser, loading } = useContext(AuthContext);
    const [showProfileSecurity, setShowProfileSecurity] = useState(false);
    const search = useSearchParams();
    const from = search.get("redirectUrl") || "/login?redirectUrl=profile/security";
    useEffect(() => {
        if (loading) {
            setShowProfileSecurity(false)
        }
        if (!loading) {
            setShowProfileSecurity(true)
        }
        if (!loading && !fetchedUser) {
            router.replace(from)
        }
    }, [loading, fetchedUser, from, router])
    const [formData, setFormData] = useState({
        previousPassword: "",
        newPassword: "",
        retypeNewPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.previousPassword.trim()) {
            newErrors.previousPassword = "Previous Password is required";
        }
        if (!formData.newPassword.trim()) {
            newErrors.newPassword = "New Password is required";
        }
        if (formData.newPassword !== formData.retypeNewPassword) {
            newErrors.retypeNewPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length === 0) {
            formData.targetUsername = fetchedUser.username
            const { data } = await axios.post("/api/changepass", formData)
            if(data.status===404){
                toast.error(data.message)
            }
            if(data.status===200){
                toast.success(data.message)
                router.push("/profile")
            }
            setFormData({
                previousPassword: "",
                newPassword: "",
                retypeNewPassword: "",
            });
        } else {
            setErrors(newErrors);
        }
    };
    if(!showProfileSecurity)return <LoadingProfile/>
    if(fetchedUser) return (
        <div className="cardinhome">
            <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4 w-[95%] lg:w-[90%] ">
                <div className="flex flex-col">
                    <label htmlFor="previousPassword" className="mb-1 text-gray-600 dark:text-white ">
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="previousPassword"
                        name="previousPassword"
                        value={formData.previousPassword}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.previousPassword && (
                        <p className="text-red-500 text-sm">{errors.previousPassword}</p>
                    )}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="newPassword" className="mb-1 text-gray-600 dark:text-white ">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm">{errors.newPassword}</p>
                    )}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="retypeNewPassword" className="mb-1 text-gray-600 dark:text-white ">
                        Retype New Password
                    </label>
                    <input
                        type="password"
                        id="retypeNewPassword"
                        name="retypeNewPassword"
                        value={formData.retypeNewPassword}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.retypeNewPassword && (
                        <p className="text-red-500 text-sm">{errors.retypeNewPassword}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="forum-btn1 bg-[#308853]"
                >
                    Change Password
                </button>
            </form>

            {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
    );
};

export default ProfileSecurity;
