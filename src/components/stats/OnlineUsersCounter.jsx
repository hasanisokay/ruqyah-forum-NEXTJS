'use client';
import AuthContext from '@/contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { io } from "socket.io-client";
const OnlineUsersCounter = ({setLoggedInUsersCount, setAnonymousUsersCount}) => {

  const { fetchedUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (socket && setLoggedInUsersCount && setAnonymousUsersCount) {
      socket.on('userConnected', async ({ loggedInUsersCount, anonymousUsersCount }) => {
        setLoggedInUsersCount(loggedInUsersCount);
        setAnonymousUsersCount(anonymousUsersCount);
      });

      socket.on('userDisconnected', async ({ loggedInUsersCount, anonymousUsersCount }) => {
        setLoggedInUsersCount(loggedInUsersCount);
        setAnonymousUsersCount(anonymousUsersCount);
      });

      socket.on('anonymousUserConnected', async ({ loggedInUsersCount, anonymousUsersCount }) => {
        setLoggedInUsersCount(loggedInUsersCount);
        setAnonymousUsersCount(anonymousUsersCount);
      });

      socket.on('anonymousUserDisconnected', async ({ loggedInUsersCount, anonymousUsersCount }) => {
        setLoggedInUsersCount(loggedInUsersCount);
        setAnonymousUsersCount(anonymousUsersCount);
      });
    }
    return ()=>{
      socket?.off("userConnected")
      socket?.off("userDisconnected")
      socket?.off("anonymousUserConnected")
      socket?.off("anonymousUserDisconnected")
    }

  }, [setLoggedInUsersCount, setAnonymousUsersCount, socket, fetchedUser]);

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

  return (
    <div>

    </div>
  );
};

export default OnlineUsersCounter;
