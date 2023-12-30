'use client'
import AuthContext from "@/contexts/AuthContext";
import imageUpload from "@/utils/imageUpload";
import resizeImage from "@/utils/resizeImage";
import axios from "axios";
import Image from "next/image";
import { useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaPhotoFilm, FaVideo } from "react-icons/fa6";
import TextareaAutosize from 'react-textarea-autosize';


const PostEditModal = ({ setterFunction, post, setPost }) => {
    const dropAreaRef = useRef(null);
    const { fetchedUser } = useContext(AuthContext);
    const [editedText, setEditedText] = useState(post?.post);
    const [showVideoUploadArea, setVideoShowUploadArea] = useState(false);
    const [showUploadArea, setShowUploadArea] = useState(false);
    const [loadingEditedPost, setLoadingEditedPost] = useState(false);
    const [uploadProgess, setUploadProgess] = useState(0);
    const [currntUploadingImageIndex, setCurrntUploadingImageIndex] = useState(null);
    const [completedImageUploadIndexs, setCompletedImageUploadIndexs] = useState([]);
    const [mediaFiles, setMediaFiles] = useState(post?.photos?.length > 0 ? post?.photos : []);
    let newPhotosArray = post?.photos?.length > 0 ? post?.photos : []
    const [videoLink, setVideoLink] = useState(post?.videos?.length > 0 ? post?.videos[0] : [])
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        setMediaFiles((prevMediaFiles) => [...prevMediaFiles, ...Array.from(files)]);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleFileInput = (e) => {
        const files = e.target.files;
        setMediaFiles((prevMediaFiles) => [...prevMediaFiles, ...Array.from(files)]);
    };
    const handleRemoveFile = (fileToRemove) => {
        setMediaFiles((prev) => prev.filter((file) => file !== fileToRemove));
        if (typeof (fileToRemove) === "string") {
            const index = newPhotosArray?.indexOf(fileToRemove);
            newPhotosArray.splice(index, 1)
        }
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if (editedText === post?.post && post?.photos === newPhotosArray && post?.videos === videoLink) {
            return toast.error("You didn't change anything.")
        }
        try {
            setLoadingEditedPost(true);
            if (mediaFiles?.length > 0) {
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
                            newPhotosArray.push(url);
                            setCurrntUploadingImageIndex(null);
                            setUploadProgess(0);
                            setCompletedImageUploadIndexs((prev) => [...prev, index]);
                        }
                        catch (err) {
                            console.error(err);
                        }
                    } else if (typeof (file) === "string") {
                        continue
                    }
                };
                toast.dismiss(uploading);
            }

            const toastId = toast.loading("Posting edit...");
            const dataToSend = {
                editedText,
                previousText: post?.post,
                id: post?._id,
                newPhotosArray,
                videoLink: videoLink?.length > 0 ? [videoLink] : []
            }
            const { data } = await axios.post(`/api/posts/editpost`, dataToSend);
            toast.dismiss(toastId);
            if (data.status === 200) {
                setPost((prev) => ({ ...prev, post: editedText, photos: newPhotosArray, videos: [videoLink] }))
                setterFunction(false);
                toast.success(data.message);
            }
            else {
                toast.error(data.message)
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoadingEditedPost(false);
        }
    }
    return (
        <div>
            <dialog id="editModal" className="modal">
                <div className="modal-box">
                    <div className="absolute top-0 right-0">
                        <button title="close" onClick={() => setterFunction(false)} className="btn btn-sm btn-circle">x</button>
                    </div>
                    <p className="text-center">Edit your post</p>
                    <form onSubmit={e => handleFormSubmit(e)} disabled={loadingEditedPost}>
                        <TextareaAutosize
                            value={editedText}
                            disabled={loadingEditedPost}
                            maxRows={10}
                            onChange={(e) => setEditedText(e.target.value)}
                            placeholder='Edit your post'
                            className="pl-2 resize-none py-[10px] bg-slate-200 dark:bg-[#3b3b3b] pr-[44px] rounded-md placeholder:text-sm text-sm focus:outline-none w-full"
                        />

                        {(post?.photos?.length > 0 || showUploadArea) && (
                            <div className="text-center flex justify-center items-center border-2 shadow-lg">
                                <div
                                    onDragOver={handleDragOver}
                                    disabled={loadingEditedPost}
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
                                        disabled={loadingEditedPost}
                                        className="block h-full w-full cursor-pointer absolute top-0 right-0 left-0 bottom-0 opacity-0"
                                    />
                                    <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                                        {mediaFiles?.map((file, index) => (
                                            <div key={index} className="flex flex-col min-h-[100px]">
                                                <div className="relative">
                                                    <button type="button" title="remove" disabled={loadingEditedPost} className="font-semibold absolute -top-1 right-0 text-sm z-30" onClick={() => handleRemoveFile(file)}>x</button>
                                                </div>
                                                <div className="relative">
                                                    {(file?.type?.startsWith("image/") || file?.startsWith("http")) ? (
                                                        <Image src={typeof (file) === "string" ? file : URL.createObjectURL(file)} width={80} height={40} className={`${currntUploadingImageIndex === index && "opacity-20"} ${completedImageUploadIndexs.includes(index) ? "opcity-100" : "opacity-50"} h-auto w-auto max-w-[100px] max-h-[100px]`} alt={`Image ${index}`} />
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
                                                <span className="text-xs max-w-[90px] break-words">{file?.name}</span>
                                                {completedImageUploadIndexs.includes(index) && <p className="text-xs font-semibold">Completed</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {
                            showVideoUploadArea && fetchedUser?.isAdmin && <div className="text-center">
                                <input disabled={loadingEditedPost} type="text" onChange={(e) => setVideoLink(e.target.value)} value={videoLink} placeholder="video link here" className="w-[90%] input input-bordered focus:outline-none " />
                            </div>
                        }
                        <div className=" mt-2 flex items-center justify-center gap-2">
                            <button type="button" disabled={loadingEditedPost} onClick={() => setShowUploadArea(!showUploadArea)}>
                                <FaPhotoFilm className="w-6 h-6" />
                            </button>
                            {fetchedUser?.isAdmin && <button type="button" disabled={loadingEditedPost} onClick={() => setVideoShowUploadArea(!showVideoUploadArea)}>
                                <FaVideo className="w-6 h-6" />
                            </button>}
                        </div>

                        <div className="text-center">
                            <button type="submit" className="text-[10px] forum-btn1 bg-[#308853]">Submit edit</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default PostEditModal;