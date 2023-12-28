import AuthContext from "@/contexts/AuthContext";
import formatDateForUserJoined from "@/utils/formatDateForUserJoined";
import formatDateInAdmin from "@/utils/formatDateInAdmin";
import handleAdminAction from "@/utils/handleAdminAction";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeart, FaRegComment, FaRegHeart, FaUserLarge } from "react-icons/fa6";
import LoadingCards from "./LoadingCards";
import LoadingModalUser from "./LoadingModal";
import LoadingModalData from "./LoadingModalData";
import axios from "axios";

const ModalUser = ({ username, setterFunction }) => {
    const [user, setUser] = useState({});
    const { fetchedUser } = useContext(AuthContext);
    const [postsByUser, setPostsByUser] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [seeAllPostsClicked, setSeeAllPostsClicked] = useState(false);
    const [loadingPostData, setLoadingPostData] = useState(false);
    const router = useRouter();
    const handleSeeAllPost = async () => {
        setLoadingPostData(true);
        const res = await fetch(`/api/userdetails?allpostby=${username}`)
        const data = await res.json();
        setLoadingPostData(false);
        if (fetchedUser?.isAdmin) {
            setPostsByUser(data?.posts);
        }
        else {
            setPostsByUser(data?.posts?.filter((post) => post.status === "approved"))
        }
        setSeeAllPostsClicked(true);
    }
    const handleDeclinePost = async (id, username) => {
        const dataToSend = { actionBy: fetchedUser.username, postAuthorUsername: username, postID: id, action: "decline" }
        const toastID = toast.loading("Declining...")
        const { data } = await axios.post("/api/posts/changestatus", dataToSend)
        toast.dismiss(toastID)
        if (data.status === 200) {
            toast.success(data.message)
            setPostsByUser((prevPosts) => prevPosts.filter((post) => post._id !== id));
        }
        else {
            toast.error("Internal Server Error. Please try again")
        }
    }
    const handleApprovePost = async (id, username) => {
        const dataToSend = { actionBy: fetchedUser.username, postAuthorUsername: username, postID: id, action: "approve" }
        const toastID = toast.loading("Approving...")
        const { data } = await axios.post("/api/posts/changestatus", dataToSend)
        toast.dismiss(toastID)
        if (data.status === 200) {
            toast.success(data.message)
            setPostsByUser((prevPosts) => prevPosts.filter((post) => post._id !== id));
        }
        else {
            toast.error("Internal Server Error. Please try again")
        }
    }
    useEffect(() => {
        if (username) {
            (async () => {
                setLoadingUser(true);
                const res = await fetch(`/api/userdetails?username=${username}`)
                const data = await res?.json();
                if (data?.status === 200) {
                    setUser(data?.user)
                    setLoadingUser(false);
                }
                else {
                    toast.error("Server Error.")
                    setterFunction(null);
                }
            })()
        }
    }, [username, setterFunction])

    useEffect(() => {
        const handleCloseModal = (event) => {
            if (event.target.classList.contains("modal-backdrop")) {
                setterFunction(null);
            }
        };
        document.addEventListener("click", handleCloseModal);
        return () => {
            document.removeEventListener("click", handleCloseModal);
        };
    }, [setterFunction]);

    return (
        <div>
            <dialog id="my_modal_5" className=" modal modal-bottom sm:modal-middle">
                <input type="checkbox" id="my_modal_5" className="modal-toggle" />
                <div className="modal-box scrollforchat">
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-0" onClick={() => setterFunction(null)}>✕</button>
                        </form>
                    </div>
                    {
                        loadingUser ? <LoadingModalData /> : <div>
                            <div className="flex items-center justify-center">
                                {user.photoURL ? <Image className="max-w-[60px] max-h-[60px]" width={60} height={60} src={user?.photoURL} alt="user photo" /> : <span>User has no profile picture.</span>}
                            </div>
                            <p><span>{user?.name}</span></p>
                            <p className="text-xs">@{user?.username}</p>
                            <p className="text-xs"><span>{user?.isAdmin ? "Admin" : "Member"} since</span> {formatDateForUserJoined(new Date(user?.joined || new Date()))}</p>
                            <p className="text-xs">Gender: {user?.gender}</p>
                            {fetchedUser?.isAdmin && <div className="flex gap-2 items-center justify-center mt-2">
                                {
                                    user?.blocked ? <span className="forum-btn-sm bg-[#308853] cursor-pointer tex-white" onClick={() => handleAdminAction(user?.username, "block")}>Unblock</span> : <span className="forum-btn-sm bg-red-700 cursor-pointer text-white" onClick={() => handleAdminAction(user?.username, "block")}>Block</span>
                                }
                                {/* <span className="forum-btn-sm bg-red-700 cursor-pointer" onClick={() => handleAdminAction(user?.username, "make-admin")}>Make Admin</span> */}
                                {/* <span className="forum-btn-sm bg-red-700 cursor-pointer" onClick={() => handleAdminAction(user?.username, "delete")}>Delete User</span> */}
                            </div>}
                            <div>
                                <p className="text-sm text-center">Posts By {user?.name}</p>
                                <p className="text-xs">Total: {user?.postCounts?.total}</p>
                                {!user?.isAdmin && <div className="text-xs">
                                    <p>Pending: {user?.postCounts?.pending}</p>
                                    <p>Approved: {user?.postCounts?.approved}</p>
                                    <p>Declined: {user?.postCounts?.declined}</p>
                                </div>}
                            </div>
                            {
                                user?.postCounts?.total > 0 && !seeAllPostsClicked && <div className="my-2">
                                    {fetchedUser?.isAdmin ? <span onClick={handleSeeAllPost} className="forum-btn-sm bg-[#308853] cursor-pointer text-white">See all post</span>
                                        : user?.postCounts?.approved > 0 && <span onClick={handleSeeAllPost} className="forum-btn-sm bg-[#308853] cursor-pointer text-white">See all post</span>}
                                </div>
                            }
                            {
                                loadingPostData && <LoadingModalUser />
                            }
                            {
                                !loadingPostData && postsByUser?.length > 0 && <div>
                                    {
                                        postsByUser?.map((post) => <div key={post._id} className="my-4 p-1 bg-base-300">
                                            <div className='flex gap-2 items-center'>
                                                <div>
                                                    {
                                                        user?.photoURL ?
                                                            <Image src={user?.photoURL} blurDataURL='' alt='User Profile Photo'
                                                                width={64} height={60} loading='lazy'
                                                                style={{
                                                                    width: "45px",
                                                                    height: "45px",
                                                                    borderRadius: '50%',
                                                                }}
                                                                className='border-gray-400 border-2'
                                                            />
                                                            : <div className='flex items-center justify-center rounded-full border-gray-400 border-2 w-[45px] h-[45px]'><FaUserLarge className='' /></div>
                                                    }
                                                </div>
                                                <div className='py-2'>
                                                    <p className='font-semibold'>{user?.name}</p>
                                                    <div className='text-xs'>
                                                        <p className=''>@{user?.username}</p>
                                                        <p className='' title={post.date}> Posted: {formatDateInAdmin(new Date(post.date))}</p>
                                                        {
                                                            post?.approveDate && <p className='' title={post.date}> Approved: {formatDateInAdmin(new Date(post.approveDate))}</p>
                                                        }
                                                        {
                                                            !user?.isAdmin && !post?.approveDate && <p>Status: <span className={`${post.status === "declined" ? "text-red-400" : "text-green-500"}`}>{post.status}</span></p>
                                                        }

                                                        {
                                                            post?.status === "approved" && <span onClick={() => router.push(`/${post._id}`)} className="text-[#308853] cursor-pointer">See post</span>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                            <div className='whitespace-pre-wrap rounded-lg p-2'>
                                                {post?.post}
                                            </div>
                                            {
                                                fetchedUser?.isAdmin && <div className="text-xs my-2">
                                                    {
                                                        post?.status === "pending" && <div> <span onClick={() => handleApprovePost(post._id, username)} className="bg-[#308853] rounded-md mr-4 px-[4px] py-[2px] text-white cursor-pointer">Approve</span>  <span onClick={() => handleDeclinePost(post._id, username)} className="bg-red-700 rounded-md px-[4px] py-[2px] text-white cursor-pointer">Decline</span> </div>
                                                    }
                                                </div>
                                            }
                                            {
                                                post?.status === "approved" && <div className='flex items-center gap-6 mt-2'>
                                                    <div className='flex items-center flex-col'>
                                                        <FaRegComment className='' />
                                                        <span className='text-xs'>{(post?.comment?.length) || 0} Comments</span>
                                                    </div>
                                                    <div className='flex flex-col items-center'>
                                                        {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ? <FaHeart title='You Liked this.' className=' text-red-600' /> : <FaRegHeart />}
                                                        <span className='text-xs'>{post?.likes?.length || 0} Likes</span>
                                                    </div>
                                                </div>
                                            }
                                        </div>)
                                    }
                                </div>
                            }
                        </div>
                    }

                </div>
                <label className="modal-backdrop cursor-default" htmlFor="my_modal_5"></label>
            </dialog>

        </div>
    );
};

export default ModalUser;