'use client'
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import Image from 'next/image';
import useSWR from 'swr';
import { FaUserLarge, FaHeart } from "react-icons/fa6";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import axios from 'axios';
import toast from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '@/contexts/AuthContext';
import formatDateForUserJoined from '@/utils/formatDateForUserJoined';

const fetcher = (url) => fetch(url).then((res) => res.json());

const SinglePostInHomePage = ({ id }) => {
  const { fetchedUser } = useContext(AuthContext);
  const { data, error } = useSWR(`/api/posts/${id}`, fetcher);
  const [newCommentData, setNewCommentData] = useState("");
  const [loadingNewPost, setLoadingNewPost] = useState(false);
  const [post, setPost] = useState(data ? data[0] : []);

  useEffect(() => {
    if (data) {
      setPost(data[0])
    }
  }, [data])
  if (error) return <div>Error loading post</div>;
  if (!post) return <div>Loading...</div>;
  const handleNewCommentForm = async (e) => {
    e.preventDefault()
    if (newCommentData === "") {
      return;
    }
    if (!fetchedUser) {
      return toast.error("Log in to comment.")
    }
    const newCommentData = {
      comment: newCommentData,
      postID:id,
      date: new Date(),
      author: { username: fetchedUser.username },
    };
    try {
      const { data } = await axios.post("/api/posts/comment", newCommentData);
      console.log(data);
      // if (data.status === 200) {
      //     const updatedPost = post.map((post) => {
      //       if (post?.likes?.length > 0) {
      //         setPost(prevPost => ({ ...prevPost, likes: [...prevPost.likes, fetchedUser.username] }));
      //       } else {
      //         setPost(prevPost => ({ ...prevPost, likes: [fetchedUser.username] }));
      //       }
      //         return post;
      //     });
      //     setPost(updatedPost)
      // }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
    // setLoadingNewPost(true)

    // const toastId = toast.loading("Posting...");
    // const { data } = await axios.post("api/newpost", newPost)
    // if (data?.status === 200) {
    //   toast.dismiss(toastId)
    //   toast.success(data.message)
    //   setNewCommentData("");

    // }
    // else if (data?.status === 401) {
    //   toast.success(data.message)
    // }
    // setLoadingNewPost(false)
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
      <div className='text-xs pt-2'>
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
          <span className='text-xs'>{post?.comment?.length || 0} Comments</span>
        </div>
        <div className='flex flex-col items-center'>
          {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ? <FaHeart title='You Liked this. Click to dislike' onClick={handleDislike} className=' text-red-600 cursor-pointer' /> : <FaRegHeart title='Click to Like' onClick={hanldleLike} className='cursor-pointer' />}
          <span className='text-xs'>{post?.likes?.length || 0} Likes</span>
        </div>
      </div>
      {/* comment section */}
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
              style={{ paddingRight: "80px" }}
              onChange={(e) => setNewCommentData(e.target.value)}
              placeholder="Write your comment"
              className="textarea border-2 focus:outline-none border-gray-400 focus:border-blue-700 bordered w-full"
            />
            <div className="absolute bottom-[25%]  right-2">
              <button
                title="Post"
                disabled={loadingNewPost}
                className={`forum-btn1 ${newCommentData === ""
                  ? "bg-slate-500 cursor-default"
                  : "bg-[#308853] active:bg-[#0a4421] lg:hover:bg-[#0a4421]"
                  }`}
                type="submit"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      }
      <div />
    </div >
  );
};

export default SinglePostInHomePage;
