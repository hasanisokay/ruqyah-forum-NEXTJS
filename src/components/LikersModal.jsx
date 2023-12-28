'use client'
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserLarge } from "react-icons/fa6";
import LoadingLikers from "./LoadingLikers";

const LikersModal = ({ usernames, setterFunction }) => {
    const [likers, setLikers] = useState([])
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const getLikers = async () => {
            setLoadingUser(true);
            const { data } = await axios.post('/api/likers', { usernames })
            if (data?.status === 404) {
                return toast.error(data?.message)
            }
            setLikers((data?.userData))
            setLoadingUser(false)
        }
        if (usernames) {
            getLikers()
        }
    }, [usernames])

    return (
        <div className="">
            <input type="checkbox" id="likerModal" className="modal-toggle" />
            <div className="modal modal-middle" role="dialog">
                <div className="modal-box scrollforchat">
                    {!loadingUser &&  likers?.length > 0 && <div>
                        <h1 className="text-center font-semibold">People who liked this</h1>
                        {

                            likers?.map((user, index) => <div key={index} className="flex justify-start items-center gap-2 mb-2">
                                <div className="flex items-center justify-center">
                                    {user?.photoURL ? <Image style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: '50%',
                                    }}
                                        width={30} height={30} src={user?.photoURL} alt="user photo" /> : <div className='flex items-center justify-center rounded-full border-gray-400 border-2 w-[30px] h-[30px]'><FaUserLarge className='' /></div>}
                                </div>
                                <div>
                                    <p><span className="text-[14px]">{user?.name}</span></p>
                                    <p className="text-[10px]">@{user?.username}</p>
                                </div>
                            </div>)
                        }
                    </div>}
                    {
                        !loadingUser && likers?.length === 0 && <p className="text-center font-semibold">Oho! No one liked this.</p>
                    }
                    {
                        loadingUser && <LoadingLikers />
                    }
                </div>
                <label className="modal-backdrop cursor-default" htmlFor="likerModal" onClick={() => setterFunction(null)}></label>
            </div>

        </div>
    );
};

export default LikersModal;