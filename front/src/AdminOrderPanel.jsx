import React, { useState, useEffect } from 'react';
import axios from 'axios';
import link from './link'; // Adjust this to your server URL

export default function AdminOrderPanel() {
  const [orders, setOrders] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserAddress, setSelectedUserAddress] = useState(null); // New state for the selected user's latest address

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${link}/product/getallorders`);
      const allOrders = response.data;
      setOrders(allOrders);
      extractUniqueUsers(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Extract unique users based on uid
  const extractUniqueUsers = (orders) => {
    const userMap = new Map();

    orders.forEach((order) => {
      const { uid, address } = order;
      if (address && address.length > 0) {
        const { name, phoneno } = address[0];

        // Only add to userMap if uid is not already present
        if (!userMap.has(uid)) {
          userMap.set(uid, { name, phoneno, address, uid });
        }
      }
    });

    // Convert the userMap into an array of unique users
    setUniqueUsers(Array.from(userMap.values()));
  };

  // Fetch latest address for the selected user based on uid
  const fetchUserAddress = async (uid) => {
    try {
      const response = await axios.get(`${link}/product/getaddress/${uid}`);
      if (response.data.message === 's') {
        setSelectedUserAddress(response.data.addressofuid); // Set the latest address
      } else {
        console.error('Failed to fetch address');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Handle user selection: fetch orders based on UID and fetch the latest address
  const handleUserClick = (user) => {
    setSelectedUser(user);
    const userOrders = orders.filter((order) => order.uid === user.uid);
    setSelectedUserOrders(userOrders);
    fetchUserAddress(user.uid); // Fetch the latest address for this user
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-700 text-center">Admin Order Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Unique users list */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Users</h2>
          <div className="overflow-auto h-96">
            {uniqueUsers.length > 0 ? (
              uniqueUsers.map((user, index) => (
                <div 
                  key={index} 
                  onClick={() => handleUserClick(user)} 
                  className="cursor-pointer p-4 border-b border-gray-300 bg-white hover:bg-indigo-100 transition duration-300 rounded-lg mb-2"
                >
                  <p className="font-semibold text-lg text-indigo-900">{user.name}</p>
                  <p className="text-gray-700">Phone: {user.phoneno}</p>
                </div>
              ))
            ) : (
              <p className="text-white">No users found</p>
            )}
          </div>
        </div>

        {/* Right side: Orders for the selected user */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedUser ? `Orders for ${selectedUser.name}` : 'Select a user to view orders'}
          </h2>

          {/* Display the selected user's latest address in big red text */}
          {selectedUserAddress && (
            <div className="bg-red-100 p-4 mb-6 rounded-lg">
              <h3 className="text-red-600 text-2xl font-bold mb-2">Latest Shipping Address</h3>
              <p className="text-red-500 text-lg">{selectedUserAddress.name}</p>
              <p className="text-red-500 text-lg">Phone: {selectedUserAddress.phoneno}</p>
              <p className="text-red-500 text-lg">
                Area: {selectedUserAddress.area}, Landmark: {selectedUserAddress.landmark}
              </p>
              <p className="text-red-500 text-lg">Pincode: {selectedUserAddress.pincode}</p>
            </div>
          )}

          {/* Orders section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedUserOrders.length > 0 ? (
              selectedUserOrders.map((order, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-lg">
                  <img 
                    src={order.image} 
                    alt={order.name} 
                    className="w-full h-48 object-cover rounded-md mb-4 hover:scale-105 transition duration-300"
                  />
                  <p className="font-semibold text-xl text-blue-600">{order.name}</p>
                  <p className="text-gray-700">Price: {order.price}</p>
                  <p className="text-gray-700">Category: {order.category}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No orders found for this user</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
