import localFont from 'next/font/local';

const SegoeUIHistoric_init = localFont({ src: "../../public/fonts/Segoe UI Historic/Segoe UI Historic.woff2", display:"optional", variable:"--segoe-ui-historic", preload:true, });

export const SegoeUIHistoric = SegoeUIHistoric_init.className;