import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import link from './link'; // Backend URL

export default function ChatLayout({ currentUsername, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
  
 
    fetchMessages();
  }, );

  const fetchMessages = async () => {
    try {
      const userDetail = localStorage.getItem('userdetail');
      const parse = JSON.parse(userDetail);
      let userId;
      if (parse.uid) {
        // Google sign-in
        userId = parse.uid;
      } else if (parse._id) {
        // Normal sign-in
        userId = parse._id;
      }
      const response = await axios.get(`${link}/product/getMessages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    const userDetail = localStorage.getItem('userdetail');
    const parse = JSON.parse(userDetail);
    let userId;
    if (parse.uid) {
      // Google sign-in
      userId = parse.uid;
    } else if (parse._id) {
      // Normal sign-in
      userId = parse._id;
    }
    if (newMessage.trim() === '') return;

    const messagePayload = {
      userId: userId,
      message: newMessage,
      sender: 'user',
      username: currentUsername,
    };

    try {
      await axios.post(`${link}/product/sendMessage`, messagePayload);
      setMessages([...messages, messagePayload]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 bg-white w-80 sm:w-96 p-4 rounded-t-lg shadow-lg z-50 border-t-4 border-blue-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-600">Chat with Support</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>
      </div>

      <div className="h-64 overflow-y-auto border p-3 mb-4 bg-gray-100 rounded-lg shadow-inner">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-300 text-black rounded-bl-none'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
        )}
      </div>

      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
}
