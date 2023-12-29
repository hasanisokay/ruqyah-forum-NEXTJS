'use client'
import Image from 'next/image';
import 'swiper/css';
import "swiper/css/effect-fade";
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { IoMdDownload } from "react-icons/io";
import handleDownloadImage from '@/utils/handleDownloadImage';
import { useEffect, useRef, useState } from 'react';
import { Pagination } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

const ImageModal = ({ activeIndex, photosArray, setterFunction }) => {
    const swiperRef = useRef(null);
    const [arrowOpacity, setArrowOpacity] = useState(1);
    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'Escape':
                    setterFunction(false);
                    break;
                case 'ArrowUp':
                    swiperRef.current?.swiper.slidePrev();
                    break;
                case 'ArrowLeft':
                    swiperRef.current?.swiper.slidePrev();
                    break;
                case 'ArrowDown':
                    swiperRef.current?.swiper.slideNext();
                    break;
                case 'ArrowRight':
                    swiperRef.current?.swiper.slideNext();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setterFunction]);

    const handleSlideChange = () => {
        setTimeout(() => {
            setArrowOpacity(0);
        }, 2000);
    };

    const handleArrowHover = () => {
        setArrowOpacity(1);
    };

    const handleArrowLeave = () => {
        setTimeout(() => {
            setArrowOpacity(0);
        }, 1000);
    };

    return (
        <div>
            <dialog id="imageModal" className="modal">
                <div className="modal-box p-0  scrollforchat rounded-none">
                    {/* md:max-w-[80vw] md:max-h-[80vh] w-[300px] h-[300px] md:w-[600px]  lg:w-[800px] md:h-[400px]  max-w-[100vw] max-h-[100vh]  */}
                    <Swiper ref={swiperRef} initialSlide={activeIndex}
                        keyboard
                        pagination={{
                            type: 'fraction',
                        }}
                        onSlideChange={handleSlideChange}
                        onAfterInit={handleSlideChange}
                        lazy={true}
                        modules={[Pagination]}
                    >
                        {/* w-[300px] h-[300px] md:w-[600px]  lg:w-[800px] md:h-[400px] */}
                        {photosArray?.map((url, index) => <SwiperSlide
                            key={index} >
                            <div className='relative h-auto w-auto max-w-[100vw] min-h-[400px] max-h-[100vh]'>
                                <div className='z-10 absolute top-2 right-2 bg-black bg-opacity-40 hover:bg-opacity-100' title='click to download this image'>
                                    <IoMdDownload className='text-white w-4 h-6 cursor-pointer' onClick={() => handleDownloadImage(url)} />
                                </div>
                                <Image
                                    sizes="100vw"
                                    fill
                                    style={{ objectFit: "contain" }}
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                />
                                <div onMouseLeave={handleArrowLeave} onMouseEnter={handleArrowHover} className={`${index === 0 && 'hidden lg:hidden'} absolute lg:block hidden top-1/2 left-0  cursor-pointer `} onClick={() => swiperRef.current?.swiper.slidePrev()}>
                                    <FaArrowLeft style={{ opacity: arrowOpacity }} className='duration-1000'/>
                                </div>
                                <div onMouseLeave={handleArrowLeave} onMouseEnter={handleArrowHover} className={`${(index === photosArray.length - 1 || photosArray?.length === 0) && 'hidden lg:hidden'} cursor-pointer absolute lg:block hidden top-1/2 right-0`} onClick={() => swiperRef?.current?.swiper.slideNext()}>
                                    <FaArrowRight style={{ opacity: arrowOpacity }} className='duration-1000'/>
                                </div>
                            </div>
                        </SwiperSlide>)}
                    </Swiper>
                </div>
                <form method="dialog" className="modal-backdrop cursor-default">
                    <button className='cursor-default' onClick={() => setterFunction(false)}></button>
                </form>
            </dialog>
        </div>
    );
};

export default ImageModal;