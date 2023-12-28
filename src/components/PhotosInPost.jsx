import Image from "next/image";
import { useEffect, useState } from "react";
import ImageModal from "./ImageModal";

const PhotosInPost = ({ photosArray }) => {
    const [showSeeMore, setShowSeeMore] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [clickedImageIndex, setClickedImageIndex] = useState(null);
    useEffect(() => {
        if (photosArray?.length > 3) {
            setShowSeeMore(true);
        }
    }, [showSeeMore, photosArray])
    useEffect(() => {
        if (photosArray?.length > 2) {
            const resizedArray = photosArray.slice(0, 3)
            setPhotos(resizedArray);
        }
        else {
            setPhotos(photosArray)
        }
    }, [photosArray])
    useEffect(() => {
        if (showImageModal) {
            document?.getElementById('imageModal')?.showModal()
        }
    }, [showImageModal])
    const handleImageClick = (index) => {
        setShowImageModal(true)
        setClickedImageIndex(index)
    }
    return (
        <div className={`flex  gap-1 items-center justify-center bg-gray-600 flex-wrap ${photosArray?.length === 1 && " md:h-[400px] h-[300px]"}`}>
            {photos?.map((url, index) => <div className={`${(index === 0 && photos?.length === 3) ? "w-full h-[400px]" : (photos.length !== 1 && "w-calc")} relative ${(index !== 0 && photos?.length === 3) ? "h-[200px]" : "h-[200px]"} ${photosArray?.length === 1 && "w-full md:h-[400px] h-[300px]"} shadow-2xl  bg-gray-600`}
                key={index}>
                <Image
                    onClick={() => handleImageClick(index)}
                    style={{ objectFit: "cover" }}
                    fill
                    sizes="100vw"
                    blurDataURL={`http://localhost:3000/_next/image?${url}?w=20&h=20`}
                    loading="lazy"
                    className={`${showSeeMore && index === 2 && "opacity-80"}  w-full h-full`}
                    src={url}
                    alt="attatched image"
                />
                {
                    showSeeMore && index === 2 && <div onClick={() => handleImageClick(index)} className=" lg:hover:bg-black lg:hover:opacity-70 top-0 absolute w-full h-full cursor-pointer">
                        <p className="text-white text-[30px] font-smibold text-center w-full h-full flex items-center justify-center" >+{photosArray?.length - 3}</p>
                    </div>
                }
                {
                    showImageModal && <ImageModal activeIndex={clickedImageIndex} photosArray={photosArray} setterFunction={setShowImageModal} />
                }
            </div>)}
        </div>
    );
};

export default PhotosInPost;