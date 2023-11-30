'use client'
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import LoadingAdmin from './LoadingAdmin';
import SearchUserForm from '@/components/SearchUserForm';
import toast from 'react-hot-toast';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import axios from 'axios';
import AuthContext from '@/contexts/AuthContext';
const Dashboard = () => {
    const [postData, setPostData] = useState(null);
    const { fetchedUser } = useContext(AuthContext);
    const [loadingData, setLoadingData] = useState(false);
    const [retrievedUser, setRetrievedUser] = useState(null);
    const handleAdminAction = async (username, action) => {
        const { data } = await axios.post("api/admin/changeuserrole", { username, action, actionBy: fetchedUser.username })
        if(data.status===200){
            toast.success(data.message)
        }
        else{
            toast.error(data.message)
        }
    }
    const handleSearch = async (username) => {
        try {
            const toastID = toast.loading("Getting user information")
            const response = await fetch(`/api/admin/searchUser?username=${username}`);
            const userData = await response.json();
            toast.dismiss(toastID)
            if (userData.status === 404 || userData.status === 500) {
                return toast.error(userData.message)
            }
            toast.success("Success to retrieve user data.")
            setRetrievedUser(userData)
            document.getElementById('my_modal_5').showModal();
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true)
                const response = await fetch('/api/getstat');
                const jsonData = await response.json();
                setLoadingData(false)
                setPostData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='cardinhome'>
            <h2 className='font-semibold text-center text-lg mt-6'>Total counts</h2>
            {loadingData && <LoadingAdmin />}

            {postData && (
                <div className='flex items-center flex-col'>
                    <div>
                        <p>Pending Posts: <span className='font-semibold'>{postData.totalPendingPosts}</span></p>
                        <p>Approved Posts: <span className='font-semibold'>{postData.totalApprovedPosts}</span></p>
                        <p>Declined Posts: <span className='font-semibold'>{postData.totalDeclinedPosts}</span></p>
                        <p>Notices: <span className='font-semibold'>{postData.totalNoticesCount}</span></p>
                        <p>Users: <span className='font-semibold'>{postData.totalUsersCount}</span></p>
                        <p>Admins: <span className='font-semibold'>{postData.totalAdminCount}</span></p>
                    </div>
                </div>
            )}
            <div>
                <SearchUserForm onSearch={(username) => handleSearch(username)} />
            </div>

            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    {<div>
                        <div className='flex items-center justify-center'>
                            {retrievedUser?.photoURL? <Image src={retrievedUser?.photoURL} alt='User pp' width={150} height={150} /> : "User has no profile photo" }
                        </div>
                        <p>Name: {retrievedUser?.name}</p>
                        <p>Username: {retrievedUser?.username}</p>
                        <p>Phone: {retrievedUser?.phone}</p>
                        <p>Email: {retrievedUser?.email}</p>
                        <p>Admin Status: {retrievedUser?.isAdmin ? "Admin" : "No"}</p>
                        {
                            !retrievedUser?.isAdmin && <button onClick={() => handleAdminAction(retrievedUser.username, "make-admin")} className='forum-btn1 bg-[#308853] mr-2' >Make Admin</button>
                        }
                        {
                            !retrievedUser?.blocked ? <button onClick={() => handleAdminAction(retrievedUser.username, "block")} className='forum-btn1 bg-red-600'>Block</button> : <button onClick={() => handleAdminAction(retrievedUser.username, "unblock")} className='forum-btn1 bg-[#308853]'>Unblock</button>
                        }
                        <p>Gender: {retrievedUser?.gender}</p>
                        <p>Joined: {formatDateInAdmin(new Date(retrievedUser?.joined))}</p>
                        <button onClick={() => handleAdminAction(retrievedUser.username, "delete")} className='forum-btn1 bg-red-700'>Delete User</button>
                    </div>}
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

export default Dashboard;
