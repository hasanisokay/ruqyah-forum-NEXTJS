'use client'
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import Image from 'next/image';
import useSWR, { mutate } from 'swr';
import { FaUserLarge, FaHeart } from "react-icons/fa6";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import axios from 'axios';
import toast from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '@/contexts/AuthContext';
import formatDateForUserJoined from '@/utils/formatDateForUserJoined';
import { RiSendPlane2Fill } from "react-icons/ri";
import { comment } from 'postcss';
import { notFound } from 'next/navigation'
import LoadingCards from '@/components/LoadingCards';
const fetcher = (url) => fetch(url).then((res) => res.json());

const SinglePostInHomePage = ({ id }) => {
  const { fetchedUser } = useContext(AuthContext);
  const { data, error, isLoading } = useSWR(`/api/posts/${id}`, fetcher);
  const [newCommentData, setNewCommentData] = useState("");
  const [loadingNewPost, setLoadingNewComment] = useState(false);
  const [post, setPost] = useState(data ? data[0] : []);
  console.log(data);
  useEffect(() => {
    if (data) {
      setPost(data[0])
    }
  }, [data])
  if (error || data?.status === 500) return notFound();
  if (!post || isLoading) return <LoadingCards />;
  console.log(post);

  const handleNewCommentForm = async (e) => {
    e.preventDefault()
    if (newCommentData === "") {
      return;
    }
    if (!fetchedUser) {
      return toast.error("Log in to comment.")
    }

    const dataToSend = {
      postAuthorUsername: post.authorInfo.username,
      name: fetchedUser.name,
      comment: newCommentData,
      postID: id,
      date: new Date(),
      author: { username: fetchedUser.username },
    };
    try {
      setLoadingNewComment(true);
      const { data } = await axios.post("/api/posts/comment", dataToSend);
      if (data.status === 200) {
        const updatedComment = {
          comment: newCommentData,
          author: {
            username: fetchedUser.username,
            authorInfo: {
              name: fetchedUser.name,
              photoURL: fetchedUser.photoURL,
              isAdmin: fetchedUser.isAdmin,
            },
          },
          date: new Date(),
        };
        setPost((prevPost) => ({
          ...prevPost,
          comment: [updatedComment, ...prevPost.comment],
        }));
        setNewCommentData("");
        setLoadingNewComment(false);
        mutate();
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };
  const handleDislike = async () => {
    if (!fetchedUser) {
      return toast.error("Log in to react")
    }
    const dataToSend = {
      postID: id, action: "dislike", actionByUsername: fetchedUser?.username
    }
    try {
      const { data } = await axios.post("/api/posts/reaction", dataToSend);

      if (data.status === 200) {
        const filteredLikesArray = post?.likes?.filter((uname) => uname !== fetchedUser.username)
        setPost(prevPost => ({ ...prevPost, likes: filteredLikesArray }));
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  }
  const hanldleLike = async () => {
    if (!fetchedUser) {
      return toast.error("Log in to react")
    }
    const dataToSend = {
      postID: id, action: "like", actionByUsername: fetchedUser?.username
    }
    try {
      const { data } = await axios.post("/api/posts/reaction", dataToSend);
      if (post._id === id) {
        if (post?.likes?.length > 0) {
          setPost(prevPost => ({ ...prevPost, likes: [...prevPost.likes, fetchedUser.username] }));
        } else {
          setPost(prevPost => ({ ...prevPost, likes: [fetchedUser.username] }));
        }
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  }
  return (
    <div className='p-2 cursor-default border-2 m-2 rounded-lg dark:border-gray-400 cardinhome'>
      <div className='flex gap-2 items-center'>
        <div>
          {
            post?.authorInfo?.photoURL ?
              <Image src={post?.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
                width={64} height={0} loading='lazy'
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
          <p className='font-semibold'>{post?.authorInfo?.name}</p>

          <div className='text-xs'>
            <p className=''>@{post?.authorInfo?.username}</p>
            {post?.authorInfo?.joined && <p> <span>{post?.authorInfo?.isAdmin ? "Admin" : "Member"} since</span> {formatDateForUserJoined(new Date(post?.authorInfo?.joined || new Date()))}</p>}
          </div>
        </div>
      </div>
      <div className='whitespace-pre-wrap'>
        {post.post}
      </div>
      <div className='text-[10px] pt-2'>
        {
          post?.date && <p className='' title={post.date}> Posted: {formatDateInAdmin(new Date(post.date))}</p>
        }
        {
          post?.approveDate && <p className='' title={post.date}> Approved: {formatDateInAdmin(new Date(post.approveDate))}</p>
        }
      </div>
      {/*like section */}
      <div className='flex items-center gap-6 mt-2'>
        <div className='flex items-center flex-col'>
          <FaRegComment className='' />
          <span className='text-xs'>{(post?.comment && post?.comment[0]?.author?.authorInfo?.name && post?.comment?.length) || 0} Comments</span>
        </div>
        <div className='flex flex-col items-center'>
          {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ? <FaHeart title='You Liked this. Click to dislike' onClick={handleDislike} className=' text-red-600 cursor-pointer' /> : <FaRegHeart title='Click to Like' onClick={hanldleLike} className='cursor-pointer' />}
          <span className='text-xs'>{post?.likes?.length || 0} Likes</span>
        </div>
      </div>
      {
        fetchedUser && <div className=''>
          <form
            onSubmit={(e) => handleNewCommentForm(e)}
            className={`relative ${loadingNewPost ? "opacity-40" : "opacity-100"} mt-4`}
          >
            <TextareaAutosize
              value={newCommentData}
              disabled={loadingNewPost}
              maxRows={3}
              style={{ paddingRight: "20px" }}
              onChange={(e) => setNewCommentData(e.target.value)}
              placeholder="Write your comment"
              className="textarea border-2 focus:outline-none border-gray-400 focus:border-blue-700 bordered w-full"

            />
            <div className="absolute bottom-[20%]  right-2">
              <button
                title="click to comment"
                disabled={loadingNewPost}
                className={`forum-btn1`}
                type="submit"
              >
                < RiSendPlane2Fill className={` ${newCommentData === ""
                  ? "text-slate-500 cursor-default"
                  : "text-[#1ab744] active:text-[#0a4421] text:hover:text-[#0a4421]"
                  } w-[22px] h-[22px]`} />
              </button>
            </div>
          </form>
        </div>
      }
      {
        post?.comment?.length > 0 && post?.comment[comment.length - 1]?.author?.authorInfo?.name && <div>
          {post?.comment?.map((c, index) => (
            <div key={index} className=' my-1'>
              {
                c?.author?.authorInfo?.name && <>
                  <div className='flex gap-2 items-center'>
                    <div>
                      {
                        c?.author?.authorInfo?.photoURL ?
                          <Image src={c?.author?.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
                            width={64} height={0} loading='lazy'
                            style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: '50%',
                            }}
                            className='border-gray-400 border-2'
                          />
                          : <div className='flex items-center justify-center rounded-full border-gray-400 border-2 w-[35px] h-[35px]'><FaUserLarge className='' /></div>
                      }
                    </div>
                    <div className='py-2'>
                      <p><span className=''> <span className='text-[14px] font-semibold'>{c?.author?.authorInfo?.name}</span> </span> <span className='text-xs'>{(c.author.username === post.authorInfo.username && "Author")}</span>
                        <span className='text-xs'> {(c?.author?.authorInfo?.isAdmin && "Admin")} </span>
                      </p>
                      <div className='text-xs flex gap-2 items-center'>
                        <p className=''>@{c?.author?.username}</p>
                        <p className='text-[10px]' title={c?.date}> {formatDateInAdmin(new Date(c?.date) || new Date())}</p>
                      </div>
                    </div>
                  </div>
                  <p className='whitespace-pre-wrap pb-1'>{c.comment}</p>
                </>
              }

            </div>
          ))}
        </div>
      }
      {/* comment section */}

      <div />
    </div >
  );
};

export default SinglePostInHomePage;
