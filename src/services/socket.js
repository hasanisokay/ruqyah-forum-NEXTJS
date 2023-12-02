import getUser from '@/providers/getUser';
import { io } from 'socket.io-client';

const initializeSocket = async () => {
  try {
    // const serverUrl = 'http://localhost:3001';
    const serverUrl = 'https://forum-socket.vercel.app';
    const { user } = await getUser();
    const socket = io(serverUrl, {
      query: {
        username: user.username,
      },
    });

    socket.on('connect', () => {
      console.log('Connected to Ruqyahbd server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Ruqyahbd server');
    });

    return socket;
  } catch (error) {
    console.error('Error initializing socket Server:', error);
    throw error;
  }
};

export default initializeSocket;
