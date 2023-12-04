'use client'
import formatDateInAdmin from "@/utils/formatDateInAdmin";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegComment, FaRegHeart, FaUserLarge } from "react-icons/fa6";

const PostShowingFormat = ({ post, fetchedUser  }) => {
const router =  useRouter();
    return (
        <div className="my-4 p-1 bg-base-300 cardinhome">
            <div className='flex gap-2 items-center'>
                <div>
                    {
                        fetchedUser?.photoURL ?
                            <Image src={fetchedUser?.photoURL} blurDataURL='' alt='User Profile Photo'
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
                    <p className='font-semibold'>{fetchedUser?.name}</p>
                    <div className='text-xs'>
                        <p className=''>@{fetchedUser?.username}</p>
                        <p className='' title={post.date}> Posted: {formatDateInAdmin(new Date(post.date))}</p>
                        {
                            post?.approveDate && <p className='' title={post.date}> Approved: {formatDateInAdmin(new Date(post.approveDate))}</p>
                        }
                        {
                            !fetchedUser?.isAdmin && !post?.approveDate && <p>Status: <span className={`${post.status === "declined" ? "text-red-400" : "text-green-500"}`}>{post.status}</span></p>
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

export default PostShowingFormat;