// "use client"
// import { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const socket = io('https://localhost:3001'); // Update with the correct server URL

//   useEffect(() => {
//     // Event listener for receiving messages from the server
//     socket.on('message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     // Clean up the socket connection when the component unmounts
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (messageInput.trim() !== '') {
//       // Send the message to the server
//       socket.emit('message', messageInput);

//       // Update the local state with the sent message
//       setMessages((prevMessages) => [...prevMessages, `You: ${messageInput}`]);

//       // Clear the input field
//       setMessageInput('');
//     }
//   };

//   return (
//     <div>
//       <div>
//         {messages.map((message, index) => (
//           <div key={index}>{message}</div>
//         ))}
//       </div>
//       <div>
//         <input
//           type="text"
//           value={messageInput}
//           onChange={(e) => setMessageInput(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
