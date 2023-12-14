"use client"
import { AES, enc } from 'crypto-js';
import AuthContext from '@/contexts/AuthContext';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import Image from 'next/image';
import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import useSWRInfinite from 'swr/infinite';

import { RiSendPlane2Fill } from "react-icons/ri";
import LoadingModalUser from '@/components/LoadingModal';
import { useRouter } from 'next/navigation';
const Loader = () => <div className="text-center text-gray-500 py-2">Loading...</div>;

const fetcher = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.messages || [];
};
const decryptMessage = (text) => AES.decrypt(text, process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY).toString(enc.Utf8);
const Chat = () => {
  const router = useRouter();
  const { fetchedUser, loading } = useContext(AuthContext);
  const [inputText, setInputText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(fetchedUser.gender ==="female" ? "group2" :"group1");
  const [socket, setSocket] = useState(null);
  const messageContainerRef = useRef(null);
  const [adminsData, setAdminsData] = useState([]);
  const [loadingChatData, setLoadingChatData] = useState(false);
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.length === 0) return null; // reached the end

    return `/api/messages?groupId=${selectedGroup}&page=${pageIndex + 1}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);
  const [fetchedMessages, setFetchedMessages] = useState(data ? data?.flat()?.reverse() : []);
console.log(data);
  useEffect(() => {
    setFetchedMessages(data?.flat().reverse())
  }, [data])

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_server}/${selectedGroup}`);
    setSocket(newSocket);
    if (!data) {
      setSize(1);
    }
    return () => {
      newSocket.disconnect();
    };
  }, [selectedGroup]);
  useEffect(() => {
    (async () => {
      setLoadingChatData(true);
      const admin = await fetch("api/admin/chatdata")
      const data = await admin.json()
      setAdminsData(data)
      setLoadingChatData(false);
    })()
  })

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        if (message.groupId === selectedGroup) {
          setFetchedMessages((prevMessages) => {
            return [...prevMessages, message];
          });
        }
      });
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, setSize]);

  useEffect(() => {
    if (messageContainerRef.current) {
      const isUserAtBottom =
        messageContainerRef.current.scrollHeight -
        (messageContainerRef.current.scrollTop + messageContainerRef?.current?.clientHeight) <=
        400;

      if (isUserAtBottom) {
        setTimeout(() => {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }, 0);
      }
    }
  }, [fetchedMessages, data]);

  const sendMessage = (e) => {
    e.preventDefault()
    if (!inputText) {
      return toast.error("can't send empty message")
    }
    if (socket) {
      const encryptedMessage = AES?.encrypt(inputText, process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY)?.toString();
      socket.emit('sendMessage', { user: fetchedUser.username, text: encryptedMessage });
      setInputText('');
    }
  };
  const loadMore = () => {
    if (size > 0 && (data && (data[size - 1]?.length == undefined || data[size - 1]?.length === 0))) {
      return
    }
    setSize(size + 1)
  }
  if (!fetchedUser.isAdmin) {
    return router.push("/")
  }
  return (
    <>
      <div className="px-4 pb-2 flex flex-col cardinhome  h-[calc(100vh-100px)] bg-[#1c1c1c] relative">
        <div
          className="overflow-y-auto scrollforchat"
          ref={messageContainerRef}
        >
          {data &&
            fetchedMessages
              ?.map((message, index) => (
                <div key={message._id} className={`mb-4  ${fetchedUser?.username === message?.user ? "" : ""} `}>
                  <div className='text-center'>
                    {index === 0 && (data[data?.length - 1]?.length === 0 ? "No More Message" : <button onClick={loadMore}>Load More</button>)}

                  </div>
                  <div className={`${fetchedUser?.username === message?.user ? "flex-row-reverse lg:pl-[70px] pl-[50px]" : "flex-row pr-[40px] lg:pr-[70px]"} flex gap-2`}>
                    <Image width={30} height={30} loading='lazy'
                      title={adminsData?.find((a) => a?.username === message?.user)?.name || "unknown"}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: '50%',
                      }}
                      src={adminsData?.find((a) => a?.username === message?.user)?.photoURL || "https://i.ibb.co/4msrfNF/Screenshot-2023-12-05-112036.png"} alt='user photo' />
                    <div className=" bg-zinc-800 text-white rounded-lg p-2">
                      <p className='text-[12px] whitespace-pre-wrap'>{decryptMessage(message.text)}</p>
                      <span className='text-[8px]'>{formatDateInAdmin(new Date(message?.timestamp))}</span>
                    </div>
                  </div>
                </div>
              ))}
          {error && <div>Error loading messages</div>}
          {size > 0 && !data && <Loader />}

        </div>
        <form onSubmit={(e) => sendMessage(e)} className=" flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 rounded-lg focus:border-0 focus:outline-none border-gray-300 mr-2 p-2"
          />


          <button
            title="click to send"
            onClick={sendMessage}
            disabled={inputText == ""}
            className={`forum-btn1`}
            type="submit"
          >
            < RiSendPlane2Fill className={` ${inputText === ""
              ? "text-slate-500 cursor-default"
              : "text-[#1ab744] active:text-[#0a4421] text:hover:text-[#0a4421]"
              } w-[22px] h-[22px]`} />
          </button>


        </form>
      </div>




    </>
  );
};

export default Chat;
