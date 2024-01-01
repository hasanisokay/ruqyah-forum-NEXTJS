'use client'

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, EffectCreative } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-creative';


import Image from "next/image";
import getAdmins from "@/utils/getAdmins";
import LoadingModalData from "../LoadingModalData";

const AdminsStat = () => {
    const [loadingAdminsData, setLoadingAdminsData] = useState(false);
    const [adminsData, setAdminsData] = useState([])
    useEffect(() => {
        (async () => {
            setLoadingAdminsData(true);
            const data = await getAdmins();
            setAdminsData(data)
            setLoadingAdminsData(false);
        })()
    }, [])
    if (loadingAdminsData) return <div className="flex items-center justify-center flex-col overflow-hidden">
        <LoadingModalData />
    </div>
    return (
        <div className="w-[250px] h-[200px] mx-auto">
            <h1 className="statsHeaderTitle mb-4">Admins</h1>
            <Swiper
                grabCursor={true}
                effect={'creative'}
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: [0, 0, -400],
                    },
                    next: {
                        translate: ['100%', 0, 0],
                    },
                }}
                className="mySwiper"

                autoplay={{
                    delay: 2000,
                    disableOnInteraction: true,
                }}
                modules={[Autoplay, EffectCreative]}
            // breakpoints={{
            //     320: {
            //         slidesPerView: 1,
            //     },
            //     640: {
            //         slidesPerView: 2,
            //     },
            //     // 768: {
            //     //     slidesPerView: 3,
            //     // },
            //     // 1024: {
            //     //     slidesPerView: 4,
            //     // },
            // }}
            >
                {
                    !loadingAdminsData && adminsData?.map((admin, index) => <div key={admin?._id}>
                        <SwiperSlide>
                            <div className="relative w-[250px] h-[200px]">
                                {<Image fill className="w-full h-full" sizes="100vw" width={0} height={0} src={admin?.photoURL || "https://i.ibb.co/4msrfNF/Screenshot-2023-12-05-112036.png"} alt="users dp" />
                                }
                            </div>
                            <h3 className="font-semibold text-lg text-center" >{admin?.name}</h3>
                        </SwiperSlide>
                    </div>)
                }
            </Swiper>
        </div>
    );
};

export default AdminsStat;