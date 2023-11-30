'use client'
import LoadingProfile from "@/components/LoadingProfile";
import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserLarge } from "react-icons/fa6"
const Profile = () => {
    const { fetchedUser, loading } = useContext(AuthContext)
    const { replace, refresh, push } = useRouter()
    const search = useSearchParams();
    const from = search.get("redirectUrl") || "/login?redirectUrl=profile";
    const [showProfile, setShowProfile] = useState(false);
    const [prfilePhoto, setProfilePhoto] = useState(null);
    const [photoFileName, setPhotoFileName] = useState("");

    const handleSetProfilePicture = async () => {
        const formData = new FormData();
        formData.append("image", prfilePhoto);
        try {
            const toastID = toast.loading("Uploading");
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGTOKEN}`,
                formData
            );
            const url = response?.data?.data?.url

            fetchedUser.photoURL = url;

            const { data } = await axios.post("api/auth/uploadpp", fetchedUser)

            if (data.status === 200) {
                toast.dismiss(toastID)

                toast.success("Uploaded")
                refresh()
            }
            if (data.status === 400) {
                toast.dismiss(toastID)
                toast.error("Upload Failed. Try Again")
            }
        } catch (error) {
            toast.error("Error! Try again later")
            console.error("Image upload error:", error);
        }
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePhoto(file);
        setPhotoFileName(file.name);
    };

    useEffect(() => {
        if (loading) {
            setShowProfile(false)
        }
        if (!loading) {
            setShowProfile(true)
        }
        if (!loading && !fetchedUser) {
            replace(from)
        }
    }, [loading, fetchedUser, from, replace])
    if (!showProfile) {
        return <LoadingProfile />
    }
    const { username, email, name, gender, phone, joined, isAdmin, photoURL } = fetchedUser || {};
    if (fetchedUser) return (
        <div className="flex flex-col items-center gap-4">
            <div>
                {photoURL ? <Image src={photoURL} width={300} height={300} loading="lazy" className="border-4 border-gray-500 rounded-lg" alt="profile photo" /> : <FaUserLarge />}            </div>
            {
                 <div className="w-full py-4 text-center">
                    <label className="cursor-pointer bg-[#308853] lg:hover:bg-[#0f2216] text-white py-2 px-4 rounded-lg text-center">
                        Set Profile Photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            name="image"
                        />
                    </label>
                    {photoFileName && (
                        <p className="mt-2 text-gray-500">Selected File: {photoFileName}</p>
                    )}
                    {
                        photoFileName && <button className="forum-btn1 bg-[#308853] lg:hover:bg-[#0f2216]" onClick={handleSetProfilePicture}>Start Upload</button>
                    }
                </div>
            }
            {
                fetchedUser?.blocked && <div className="text-red-500 font-semibold cardinhome text-center">
                    <p>You are blocked by admin. You cant interact for now. Contact support for further instructions</p>
                </div>
            }
            <div className="pl-4">
                <p>Name: <span className="font-semibold">{name}</span></p>
                <p>Email: <span className="font-semibold">{email}</span></p>
                <p>Username: <span className="font-semibold">{username}</span></p>
                {
                    isAdmin && <p>Admin Status: <span className="font-semibold">You are admin</span></p>
                }
                <p>Joined: <span className="font-semibold">{joined}</span></p>
                <p>Phone: <span className="font-semibold">{phone}</span></p>
                <p>Gender: <span className="font-semibold">{gender}</span> </p>
            </div>

            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">

                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Profile;


