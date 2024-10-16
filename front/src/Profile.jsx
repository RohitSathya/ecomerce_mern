import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import link from './link';

export default function Profile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [email, setEmail] = useState('');
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false); // New state to track Google sign-in
  const [address, setAddress] = useState({
    country: 'India',
    name: '',
    phoneno: '',
    pincode: '',
    area: '',
    landmark: ''
  });
  const [savedAddress, setSavedAddress] = useState(null);

  useEffect(() => {
    // Fetch user details from localStorage
    const userdetail = localStorage.getItem('userdetail');
    if (userdetail) {
      const parsedUserDetail = JSON.parse(userdetail);
      setUserDetails(parsedUserDetail);

      // Check if the user signed in via Google (check if displayName exists)
      if (parsedUserDetail.displayName) {
        setIsGoogleSignIn(true);
      }

      // Prepopulate name based on Google or normal sign-in
      setAddress((prev) => ({
        ...prev,
        name: parsedUserDetail.displayName || parsedUserDetail.name || 'Guest'
      }));

      // Validate and set the email only if it's in a correct email format
      if (validateEmail(parsedUserDetail.email)) {
        setEmail(parsedUserDetail.email);
      }

      // Fetch saved address
      fetchAddress(parsedUserDetail);
    }
  }, []);

  const fetchAddress = async (user) => {
    try {
      const response = await axios.get(`${link}/product/getaddress/${user._id || user.uid}`);
      if (response.data.message === 's' && response.data.addressofuid) {
        setSavedAddress(response.data.addressofuid);
        setAddress(response.data.addressofuid); // Set the saved address to input fields
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleAddressSubmit = async () => {
    try {
      const userId = userDetails._id || userDetails.uid;
      if (savedAddress) {
        // Update existing address
        await axios.put(`${link}/product/updateaddress/${userId}/${address.name}/${address.phoneno}/${address.landmark}/${address.pincode}/${address.area}`);
      } else {
        // Save new address
        await axios.post(`${link}/product/address`, { ...address, uid: userId });
      }
      alert('Address updated successfully!');
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-red-500">Name</label>
        <input
          type="text"
          value={address.name}
          name="name"
          readOnly
          className="w-full p-2 border rounded text-black"
        />
      </div>

      {/* Conditionally render email input for non-Google sign-in */}
      {isGoogleSignIn ?? (
        <div className="mb-4">
          <label className="block text-red-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Let user enter email if needed
            className="w-full p-2 border rounded text-black"
            placeholder="Enter your email"
          />
        </div>
      )}

      {/* Address Fields */}
      <h2 className="text-xl font-semibold mb-4">Address</h2>
      
      {/* Country */}
      <div className="mb-4">
        <label className="block text-red-500">Country/Region</label>
        <select
          name="country"
          value={address.country}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-black"
        >
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
        </select>
      </div>

      {/* Mobile Number */}
      <div className="mb-4">
        <label className="block text-red-500">Mobile Number</label>
        <input
          type="text"
          name="phoneno"
          value={address.phoneno}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-black"
          maxLength="10"
          placeholder="Enter your mobile number"
        />
      </div>

      {/* Pincode */}
      <div className="mb-4">
        <label className="block text-red-500">Pincode</label>
        <input
          type="text"
          name="pincode"
          value={address.pincode}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-black"
          maxLength="6"
          placeholder="Enter your pincode"
        />
      </div>

      {/* Area */}
      <div className="mb-4">
        <label className="block text-red-500">Area</label>
        <input
          type="text"
          name="area"
          value={address.area}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-black"
          placeholder="Enter your area"
        />
      </div>

      {/* Landmark */}
      <div className="mb-4">
        <label className="block text-red-500">Landmark</label>
        <input
          type="text"
          name="landmark"
          value={address.landmark}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-black"
          placeholder="Enter a landmark"
        />
      </div>

      {/* Buttons */}
      <button
        onClick={handleAddressSubmit}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
      >
        Save Address
      </button>
      <button onClick={() => navigate('/')} className="ml-4 bg-gray-500 text-white p-2 rounded">
        Go Back
      </button>
    </div>
  );
}
