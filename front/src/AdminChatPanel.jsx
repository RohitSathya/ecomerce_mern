import React, { useState, useEffect } from 'react';
import axios from 'axios';
import link from './link'; // Backend URL

export default function AdminChatPanel() {
  const [users, setUsers] = useState([]); // Unique users with ongoing chats
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for chat
  const [chatMessages, setChatMessages] = useState([]); // Messages with the selected user
  const [newMessage, setNewMessage] = useState(''); // New message to be sent
   const [n,sn]=useState()
  useEffect(() => {
    // Fetch the unique users who have ongoing chats
    fetchUsersWithChats();
  }, []);

  const fetchUsersWithChats = async () => {
    try {
      const response = await axios.get(`${link}/product/getUniqueChats`);
      setUsers(response.data); // Set unique users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchChatMessages = async (userId,na) => {
    sn(na)
  
    try {
      const response = await axios.get(`${link}/product/getMessages/${userId}`);
      setChatMessages(response.data); // Set messages for the selected user
      setSelectedUser(userId); // Set the selected user
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messagePayload = {
      userId: selectedUser,
      message: newMessage,
      sender: 'admin',
    };

    try {
      await axios.post(`${link}/product/sendMessage`, messagePayload);
      setChatMessages([...chatMessages, messagePayload]); // Append the sent message
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-700 text-center">Admin Chat Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: List of users with chats */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Users</h2>
          <div className="overflow-auto h-96">
            {users.length > 0 ? (
              users.map((user, index) => (
                <div
                  key={index}
                  onClick={() => fetchChatMessages(user._id,user.name)}
                  className="cursor-pointer p-4 border-b border-gray-300 bg-white hover:bg-indigo-100 transition duration-300 rounded-lg mb-2"
                >
                  <p className="font-semibold text-lg text-indigo-900">{user.name}</p>
                 
                </div>
              ))
            ) : (
              <p className="text-white">No users found</p>
            )}
          </div>
        </div>

        {/* Right side: Chat with the selected user */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {selectedUser ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Chat with {n}</h2>

              <div className="h-64 overflow-y-auto border p-3 mb-4 bg-gray-100 rounded-lg shadow-inner">
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block p-2 rounded-lg ${
                          msg.sender === 'admin' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-300 text-black rounded-bl-none'
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
            </>
          ) : (
            <p className="text-gray-600">Select a user to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
}
