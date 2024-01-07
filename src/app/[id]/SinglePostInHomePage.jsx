'use client'
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import Image from 'next/image';
import { io } from 'socket.io-client';
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
import LoadingCards from '@/components/LoadingCards';
import ModalUser from '@/components/ModalUser';
import { BsThreeDotsVertical } from 'react-icons/bs';
import LikersModal from '@/components/LikersModal';
import Comments from '@/components/Comments';
import PostEditModal from '@/components/PostEditModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import PhotosInPost from '@/components/PhotosInPost';
import { useSearchParams } from 'next/navigation';
import copyToClipboard from '@/utils/copyToClipboard';
import VideosInPost from '@/components/video-components/VideosInPost';
import ReportModal from '@/components/ReportModal';


const SinglePostInHomePage = ({ fetchedPost}) => {
  const id = fetchedPost?._id;
  const [likersArray, setLikersArray] = useState(null);
  const { fetchedUser, showDeleteModal, setShowDeleteModal, showReportModal, setShowReportModal, isReportingPost, setIsReportingPost } = useContext(AuthContext);
  const [socket, setSocket] = useState(null)
  const [newCommentData, setNewCommentData] = useState("");
  const [loadingNewComment, setLoadingNewComment] = useState(false);
  const [selectedUsernameToShowDetails, setSelectedUsernameToShowDetails] = useState(null)
  const [post, setPost] = useState(fetchedPost);
  const [selectedPostIdForOptions, setSelectedPostIdForOptions] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [scrolledToComment, setScrolledToComment] = useState(false);

  const searchParams = useSearchParams();
  const commentID = searchParams.get('commentID');

  useEffect(() => {
    if (commentID?.length > 2 && !scrolledToComment && post) {
      const targetComment = document.getElementById(`${commentID}`);
      if (targetComment) {
        try {
          targetComment.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
          targetComment.classList.add("highlightedClass");
          setTimeout(() => {
            targetComment.classList.remove("highlightedClass");
            setScrolledToComment(true);
          }, 3000);
        }
        catch {

        }
      }
    }
  }, [commentID, scrolledToComment, post]);


  useEffect(() => {
    (async () => {
      if (fetchedUser) {
        const userSocket = await io(`${process.env.NEXT_PUBLIC_server}/?userId=${fetchedUser?.username}`);
        setSocket(userSocket);
      } else {
        const anonymousSocket = await io(process.env.NEXT_PUBLIC_server);
        setSocket(anonymousSocket);
      }
    })();
  }, [fetchedUser]);

  useEffect(() => {
    if (likersArray) {
      document?.getElementById('likerModal')?.click();
    }
  }, [likersArray]);

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', { roomId: id });
    }
  }, [id, socket])

  useEffect(() => {
    if (socket) {
      socket.on('newComment', (comment) => {
        if (comment.postID === id) {
          setPost((prevPost) => ({
            ...prevPost,
            comment: [comment, ...prevPost.comment,
            ],
          }));
        }
      });
    }
    return () => {
      if (socket) {
        socket.emit('leaveRoom', { roomId: id });
        socket.off("newComment")
      }
    };
  }, [id, socket]);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        selectedPostIdForOptions &&
        !event.target.closest('.relative')
      ) {
        // Clicked outside the options, hide them
        setSelectedPostIdForOptions(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [selectedPostIdForOptions]);

  useEffect(() => {
    if (selectedUsernameToShowDetails) {
      document.getElementById('userModal').showModal();
    }
  }, [selectedUsernameToShowDetails]);

  useEffect(() => {
    if (showEditModal) document?.getElementById('editModal')?.showModal()
  }, [showEditModal])

  if (!post) return <LoadingCards />;

  const handleShowUser = (username) => {
    setSelectedUsernameToShowDetails(username);
  }
  const handleNewCommentForm = async (e) => {
    e.preventDefault()
    if (newCommentData === "") {
      return;
    }
    if (!fetchedUser) {
      return toast.error("Log in to comment.")
    }

    const dataToSend = {
      comment: newCommentData,
      postID: id,
      date: new Date(),
      author: { username: fetchedUser?.username },
    };
    try {
      setLoadingNewComment(true);
      const { data } = await axios.post("/api/posts/comment", dataToSend);
      if (data.status === 200) {
        // send comment with socket
        const dataToSendInSocket = {
          comment: newCommentData,
          date: dataToSend.date,
          _id: data?._id,
          likes: [],
          replies: 0,
          author: {
            username: fetchedUser.username,
            authorInfo: {
              isAdmin: fetchedUser.isAdmin,
              name: fetchedUser.name,
              photoURL: fetchedUser.photoURL
            }
          },
          postID: id,
        }


        const newCommentNotification = {
          _id: data?._id,
          author: {
            username: fetchedUser?.username,
            name: fetchedUser?.name,
            photoURL: fetchedUser?.photoURL,

          },
          commentAuthor: [{ username: fetchedUser.username }],
          postAuthor: [{ username: post?.authorInfo?.username }],
          date: dataToSend?.date,
          postID: id,
          commentID: data?._id,
          type: "comment",
          read: false
        }
        if (socket) {
          socket.emit('newComment', dataToSendInSocket);
          socket.emit("newCommentNotification", { newCommentNotification });
        }
      }
      if (data.status === 500) {
        toast.error(data?.message || "error")
      }
    } catch (error) {
      console.error("Error commenting:", error);
    }
    finally {
      setNewCommentData("");
      setLoadingNewComment(false)
    }
  };

  const handleDislike = async (commentID = undefined) => {
    if (!fetchedUser) {
      return toast.error("Log in to react")
    }
    const dataToSend = {
      postID: id, action: "dislike", actionByUsername: fetchedUser?.username
    }
    try {
      if (commentID) {
        dataToSend.commentID = commentID;
      }
      const { data } = await axios.post("/api/posts/reaction", dataToSend);
      if (commentID && data.status === 200) {
        if (data.status === 200 && commentID) {
          setPost((prevPost) => ({
            ...prevPost,
            comment: prevPost.comment.map((c) =>
              c._id === commentID
                ? {
                  ...c,
                  likes: c.likes.filter((uname) => uname !== fetchedUser.username),
                }
                : c
            ),
          }))
        }
      }
      if (data.status === 200 && !commentID) {
        const filteredLikesArray = post?.likes?.filter((uname) => uname !== fetchedUser.username)
        setPost(prevPost => ({ ...prevPost, likes: filteredLikesArray }));
      }

    } catch (error) {
      console.error("Error disliking post:", error);
    }
  }
  const hanldleLike = async (commentID = undefined) => {
    if (!fetchedUser) {
      return toast.error("Log in to react")
    }
    const dataToSend = {
      postID: id, action: "like", actionByUsername: fetchedUser?.username
    }
    try {
      if (commentID) {
        dataToSend.commentID = commentID;
      }
      const { data } = await axios.post("/api/posts/reaction", dataToSend);
      if (data.status === 200 && commentID) {
        setPost((prevPost) => ({
          ...prevPost,
          comment: prevPost.comment.map((c) =>
            c._id === commentID
              ? {
                ...c,
                likes: [...c.likes, fetchedUser.username]
              }
              : c
          ),
        }))
      }
      if (data.status === 200 && !commentID) {
        if (post._id === id) {
          if (post?.likes?.length > 0) {
            setPost(prevPost => ({ ...prevPost, likes: [...prevPost?.likes, fetchedUser?.username] }));
          } else {
            setPost(prevPost => ({ ...prevPost, likes: [fetchedUser?.username] }));
          }
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }
  const handleEdit = () => {
    if (fetchedUser.username !== post?.authorInfo?.username) return toast.error("unauthorized action")
    setShowEditModal(true);
  }
  const handleClickReport = async () => {
    setShowReportModal(true);
    setIsReportingPost(true);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNewCommentForm(e);
    }
  }

  return (
    <div className='p-2 cursor-default bg-[#fffef9] dark:bg-[#242526] m-2 rounded-lg dark:border-gray-400 cardinhome shadow-xl'>
      <div className='relative'>
        <BsThreeDotsVertical onClick={() => setSelectedPostIdForOptions(id)} className='absolute right-0 cursor-pointer' />
        {selectedPostIdForOptions === id && (
          <div className='absolute text-sm right-0 top-2 mt-2 p-1 max-w-[200px] z-10 shadow-xl rounded-md bg-[#f3f2f0] dark:bg-[#1c1c1c]'>
            <div className='flex flex-col justify-start items-start gap-2 dark:text-white text-black  '>
              {(fetchedUser?.isAdmin || fetchedUser?.username === post?.authorInfo?.username) && <button onClick={() => setShowDeleteModal(true)} className='lg:hover:bg-red-700 forum-btn2'>Delete Post</button>}
              {fetchedUser?.username === post?.authorInfo?.username && <button onClick={handleEdit} className='forum-btn2 lg:hover:bg-slate-500 w-full'>Edit Post</button>}
              <button className='forum-btn2 lg:hover:bg-slate-500 w-full' onClick={() => copyToClipboard(`https://forum.ruqyahbd.org/${id}`)}>Copy link</button>
              {fetchedUser && <button onClick={handleClickReport} className='forum-btn2 lg:hover:bg-slate-500 w-full'>Report</button>}
            </div>
          </div>
        )}
      </div>
      <div className='flex gap-2 items-center'>
        <div onClick={() => handleShowUser(post?.authorInfo?.username)} className='cursor-pointer'>
          {
            post?.authorInfo?.photoURL ?
              <Image src={post?.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
                width={64} height={0} priority={true}
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
          <p onClick={() => handleShowUser(post?.authorInfo?.username)} className='font-semibold cursor-pointer'>{post?.authorInfo?.name}</p>

          <div className='text-xs'>
            <p className=''>@{post?.authorInfo?.username}</p>
            {post?.authorInfo?.joined && <p> <span>{post?.authorInfo?.isAdmin ? "Admin" : "Member"} since</span> {formatDateForUserJoined(new Date(post?.authorInfo?.joined || new Date()))}</p>}
          </div>
        </div>
      </div>
      <div className='whitespace-pre-wrap'>
        {post.post}
      </div>

      <div>
        {
          post?.videos && post?.videos?.length > 0 && <div>
            <VideosInPost videosArray={post?.videos} />
          </div>
        }
        {
          post?.photos && post?.photos?.length > 0 && <PhotosInPost
            photosArray={post?.photos}
            key={id}
          />
        }

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
          {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ? <FaHeart title='You Liked this. Click to dislike' onClick={() => handleDislike()} className=' text-red-600 cursor-pointer' /> : <FaRegHeart title='Click to Like' onClick={() => hanldleLike()} className='cursor-pointer' />}
          <span className='text-xs cursor-pointer' onClick={() => setLikersArray(post?.likes)}>{post?.likes?.length || 0} Likes</span>
        </div>

      </div>
      {
        fetchedUser && !fetchedUser?.blocked && <div>
          <form
            onSubmit={(e) => handleNewCommentForm(e)}
            className={`relative ${loadingNewComment ? "opacity-40" : "opacity-100"} mt-4`}
          >
            <TextareaAutosize
              value={newCommentData}
              disabled={loadingNewComment}
              maxRows={3}
              onKeyDown={handleKeyDown}
              onChange={(e) => setNewCommentData(e.target.value)}
              placeholder={`Comment as ${fetchedUser.name}`}
              className="pl-2 resize-none py-[10px] bg-slate-200 dark:bg-[#3b3b3b] pr-[44px] rounded-xl placeholder:text-[12px] text-sm focus:outline-none w-full"

            />
            <div className="absolute bottom-[20%]  right-2">
              <button
                title="click to comment"
                disabled={loadingNewComment}
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
            <Comments
              key={index}
              c={c}
              setPost={setPost}
              socket={socket}
              postID={id}
              commentId={c?._id}
              replies={c?.replies}
              likes={c?.likes}
              postAuthor={post?.authorInfo?.username}
              handleShowUser={handleShowUser}
              setLikersArray={setLikersArray}
              handleDislike={handleDislike}
              hanldleLike={hanldleLike}
            />
          ))}
        </div>
      }
      {
        showReportModal && isReportingPost && <ReportModal postID={id} key={id} type={"post"} />
      }
      {
        showEditModal && fetchedUser?.username === post?.authorInfo?.username && <PostEditModal setPost={setPost} setterFunction={setShowEditModal} post={post} />
      }
      {
        showDeleteModal && <DeleteConfirmationModal id={id} isAuthorized={fetchedUser?.isAdmin || fetchedUser?.username === post?.authorInfo?.username} setterFunction={setShowDeleteModal} />
      }
      {likersArray && <LikersModal usernames={likersArray} setterFunction={setLikersArray} />}
      {selectedUsernameToShowDetails && <ModalUser username={selectedUsernameToShowDetails} setterFunction={setSelectedUsernameToShowDetails} />}
      <div />
    </div >
  );
};
export default SinglePostInHomePage;