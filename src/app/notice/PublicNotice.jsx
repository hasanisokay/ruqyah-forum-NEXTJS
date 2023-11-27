"use client"
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import { useContext, useEffect, useState } from 'react';
import LoadingNoticePublic from './LoadingNoticePublic';
import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const PublicNotice = () => {
    const [data, setData] = useState(null);
    const { fetchedUser } = useContext(AuthContext);
    const [loadingNotice, setLoadingNotice] = useState(true);
    const handleDeleteNotice = async (id) => {
        const toastID = toast.loading("Deleting...")
        const { data } = await axios.post("/api/admin/deletenotice", { id })
        toast.dismiss(toastID)
        if (data.status === 200) {
            toast.success(data.message)
        }
        else {
            toast.error("Try again")
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingNotice(true);
                const response = await fetch("/api/getnotice");
                const jsonData = await response.json();
                setData(jsonData);
                setLoadingNotice(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    if (loadingNotice) return <LoadingNoticePublic />

    return (
        <div className='cardinhome'>
            {
                (!loadingNotice && data?.length === 0) ? <div className='py-6 text-center'>
                    No notice
                </div> : (!loadingNotice && <h3 className='text-center text-lg font-semibold'>Welcome to Notice Section</h3>)
            }            {
                data?.map((notice, index) => <div key={notice._id}>
                    <div className="collapse collapse-arrow border-2 shadow-md my-1">
                        <input type="radio" name="my-accordion-2" defaultChecked={index === 0} />
                        <div className="collapse-title">
                            {notice?.title}
                        </div>
                        <div className="collapse-content font-semibold whitespace-pre-wrap">
                            <p>{notice.notice}</p>
                            <p className='text-xs'>
                            Notice Date: {formatDateInAdmin(new Date(notice.date))}
                            </p>
                            {fetchedUser.isAdmin && <button className='forum-btn1 bg-red-600 mt-2' onClick={() => handleDeleteNotice(notice._id)}>Delete</button>}
                        </div>
                    </div>
                </div>)
            }
        </div>
    );
};

export default PublicNotice;
