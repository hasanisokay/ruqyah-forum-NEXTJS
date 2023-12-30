"use client"
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import TextareaAutosize from 'react-textarea-autosize';
import { FaPhotoFilm, FaVideo } from "react-icons/fa6";
import Image from "next/image";
import resizeImage from "@/utils/resizeImage";
import imageUpload from "@/utils/imageUpload";
const NewPost = () => {
    const { fetchedUser, loading } = useContext(AuthContext);
    const [newPostData, setNewPostData] = useState("");
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loadingNewPost, setLoadingNewPost] = useState(false);
    const dropAreaRef = useRef(null);
    const [showUploadArea, setShowUploadArea] = useState(false);
    const [uploadProgess, setUploadProgess] = useState(0);
    const [currntUploadingImageIndex, setCurrntUploadingImageIndex] = useState(null);
    const [completedImageUploadIndexs, setCompletedImageUploadIndexs] = useState([]);
    const [showNewPostModal, setShowNewPostModal] = useState(false)
    const [uploadedImageUrls, setUploadedImageUrls] = useState([])
    const [showVideoUploadArea, setShowVideoUploadArea] = useState(false);
    const [videoLink, setVideoLink] = useState("")
    const handleNewPostForm = async (e) => {
        e.preventDefault();
        if (newPostData === "") {
            return;
        }
        const newPost = {
            post: newPostData,
            date: new Date(),
            author: { username: fetchedUser?.username },
            comment: [],
            likes: [],
            followers: [fetchedUser?.username],
            photos: [],
            videos: []
        };
        setLoadingNewPost(true)
        if (mediaFiles.length > 0) {
            const config = {
                onUploadProgress: function (progressEvent) {
                    const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgess(percentCompleted);
                }
            }
            const uploading = toast.loading("Uploading...")
            for (const [index, file] of mediaFiles.entries()) {
                setCurrntUploadingImageIndex(index);
                if (file?.type?.startsWith("image/")) {
                    try {
                        const resizedImage = await resizeImage(file, 1200, 800, "ruqyahbd-forum");
                        const url = await imageUpload(resizedImage, config)
                        setUploadedImageUrls((prev) => [...prev, url])
                        newPost?.photos?.push(url)
                        setCurrntUploadingImageIndex(null);
                        setUploadProgess(0);
                        setCompletedImageUploadIndexs((prev) => [...prev, index]);
                    }
                    catch (err) {
                        console.error(err);
                    }
                } else if (!file?.type?.startsWith("image/")) {
                    return toast.error("Upload image file only")
                }
            };
            toast.dismiss(uploading);
        }
        if (fetchedUser?.isAdmin) {
            newPost.status = "approved"
        }
        if(fetchedUser?.isAdmin && videoLink){
            newPost.videos.push(videoLink)
        }
        const toastId = toast.loading("Posting...");
        const { data } = await axios.post("/api/newpost", newPost)
        setCompletedImageUploadIndexs([]);
        setUploadedImageUrls([]);
        toast.dismiss(toastId);

        if (data?.status === 200) {
            toast.success(data.message)
            setNewPostData("");
            setShowUploadArea(false);
            setMediaFiles([]);
            setUploadedImageUrls([]);
            setShowNewPostModal(false);
        }
        else if (data?.status === 401) {
            toast.error(data.message)
        }
        setLoadingNewPost(false)
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        setMediaFiles((prevMediaFiles) => [...prevMediaFiles, ...Array.from(files)]);

    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleRemoveFile = (fileToRemove) => {
        setMediaFiles((prev) => prev.filter((file) => file !== fileToRemove));
    };
    const handleFileInput = (e) => {
        const files = e.target.files;
        setMediaFiles((prevMediaFiles) => [...prevMediaFiles, ...Array.from(files)]);
    };
    useEffect(() => {
        const handleOutsideClick = (event) => {
            const modal = document.getElementById('newPostModal')
            if (showNewPostModal && event?.target?.contains(modal)) {
                setShowNewPostModal(false);
                document.getElementById('newPostModal').close();
            }
        }
        document.addEventListener("click", handleOutsideClick)
        return () => {
            document.removeEventListener("click", handleOutsideClick)
        }
    }, [showNewPostModal])
    useEffect(() => {
        if (showNewPostModal) {
            document.getElementById('newPostModal').showModal()
        }
        if (!showNewPostModal) {
            document.getElementById('newPostModal')?.close();
        }
    }, [showNewPostModal])


    if (fetchedUser && loading === false && !fetchedUser?.blocked) {
        return (
            <div className="mb-4">
                <div className="cardinhome">
                    <input
                        className="textarea w-full resize-none placeholder-shown:text-center bg-slate-200 dark:bg-[#3b3b3b] focus:outline-none"
                        placeholder="Write your post"
                        onClick={() => setShowNewPostModal(true)}
                    />

                </div>
                <div className="post-modal">
                    <dialog id="newPostModal" className="modal">
                        <div className="modal-box">
                            <form
                                onSubmit={(e) => handleNewPostForm(e)}
                                className={` ${loadingNewPost ? "opacity-80" : "opacity-100"}`}
                            >
                                <TextareaAutosize
                                    value={newPostData}
                                    disabled={loadingNewPost}
                                    maxRows={8}
                                    onChange={(e) => setNewPostData(e.target.value)}
                                    placeholder="Write your post"
                                    className="textarea resize-none placeholder-shown:text-center bg-slate-200 dark:bg-[#3b3b3b] focus:outline-none w-full"
                                />

                                {showUploadArea && (
                                    <div className="text-center flex justify-center items-center border-2 shadow-lg">
                                        <div
                                            onDragOver={handleDragOver}
                                            disabled={loadingNewPost}
                                            onDrop={(e) => handleDrop(e)}
                                            ref={dropAreaRef}
                                            className="drop-area min-w-[300px] lg:min-w-[400px] min-h-[100px] relative cursor-pointer text-center"
                                        >
                                            <p className="text-center">Drop your photo here or click to upload</p>
                                            <input
                                                type="file"
                                                accept="image/*, video/*"
                                                onChange={handleFileInput}
                                                multiple
                                                disabled={loadingNewPost}
                                                className="block h-full w-full cursor-pointer absolute top-0 right-0 left-0 bottom-0 opacity-0"
                                            />
                                            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                                                {mediaFiles.map((file, index) => (
                                                    <div key={index} className="flex flex-col min-h-[100px]">
                                                        <div className="relative">
                                                            <button type="button" title="remove" disabled={loadingNewPost} className="font-semibold absolute -top-1 right-0 text-sm z-30" onClick={() => handleRemoveFile(file, index)}>x</button>
                                                        </div>
                                                        <div className="relative">
                                                            {file?.type?.startsWith("image/") ? (
                                                                <Image width={80} height={40} className={`${currntUploadingImageIndex === index && "opacity-20"} ${completedImageUploadIndexs.includes(index) ? "opcity-100" : "opacity-50"} h-auto w-auto max-w-[100px] max-h-[100px]`} src={URL.createObjectURL(file)} alt={`Image ${index}`} />
                                                            ) : file?.type?.startsWith("video/") ? (
                                                                <video width="280" height="200" controls>
                                                                    <source src={URL.createObjectURL(file)} type={file.type} />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            ) : (
                                                                <span>{file.name}{" unsupported file"}</span>
                                                            )}
                                                            <div className={`${currntUploadingImageIndex === index ? "opacity-100" : "opacity-0"} w-full h-full absolute top-0 bottom-0 right-0 left-0`}>
                                                                <div className="flex flex-col items-center justify-center h-full w-full">
                                                                    <p className="text-sm font-semibold">Uploading</p>
                                                                    {currntUploadingImageIndex === index && <p className="text-xs font-semibold">{uploadProgess}%</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs max-w-[90px] break-words">{file.name}</span>
                                                        {completedImageUploadIndexs.includes(index) && <p className="text-xs font-semibold">Completed</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {
                                    showVideoUploadArea && <div className="text-center">
                                        <input disabled={loadingNewPost} type="text" onChange={(e) => setVideoLink(e.target.value)} value={videoLink} placeholder="video link here" className="w-[90%] input input-bordered focus:outline-none " />
                                    </div>
                                }

                                <div className=" mt-2 flex items-center justify-center gap-2">
                                    <button type="button" disabled={loadingNewPost} onClick={() => setShowUploadArea(!showUploadArea)}>
                                        <FaPhotoFilm className="w-6 h-6" />
                                    </button>
                                    {fetchedUser?.isAdmin && <button type="button" disabled={loadingNewPost} onClick={() => setShowVideoUploadArea(!showVideoUploadArea)}>
                                        <FaVideo className="w-6 h-6" />
                                    </button>}
                                </div>

                                {newPostData && (
                                    <div className="text-center">
                                        <button
                                            title="Post"
                                            disabled={loadingNewPost}
                                            className={`forum-btn1 ${newPostData === ""
                                                ? "bg-slate-500 cursor-default"
                                                : "bg-[#308853] active:bg-[#0a4421] lg:hover:bg-[#0a4421]"
                                                }`}
                                            type="submit"
                                        >
                                            Post
                                        </button>
                                    </div>
                                )}

                            </form>
                        </div>
                    </dialog>
                </div>
            </div>
        );
    }
};

export default NewPost;
