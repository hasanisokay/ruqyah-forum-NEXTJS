'use client'

import { useEffect } from "react";

const PostError = ({error, reset}) => {
    useEffect(()=>{
        console.error(error);
    })
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl">{"Something went wrong"}</h1>
        <button onClick={()=>reset()} className="bg-red-600 px-2 py-1 rounded-2xl text-white">Reset</button>
        </div>
    );
};

export default PostError;