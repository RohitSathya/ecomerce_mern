import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fastcount } from './Redux/totalslice';
import axios from 'axios';
import link from './link';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneno, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const navid = document.getElementById('navbar');
    if (navid) navid.style.display = 'none';
  }, []);

  async function handleSubmit() {
    try {
      const response = await axios.post(link + '/product/register', {
        name,
        phoneno,
        email,
        password,
      });
      const { message, userdetail } = response.data;
      if (message === 'failed') {
        alert('Email already exists. Please use a different email.');
      } else {
        localStorage.setItem('userdetail', JSON.stringify(userdetail));
        dispatch(fastcount());
        navigate('/');
        const navid = document.getElementById('navbar');
        if (navid) navid.style.display = 'flex';
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Your Account</h1>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="First and last name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              id="phoneno"
              placeholder="Mobile Number"
              maxLength="10"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={phoneno}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Account
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-2 py-2 w-full border border-gray-300 text-indigo-600 font-semibold rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="py-2 w-full bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
          >
            Back to Home Page
          </button>
        </div>
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>By creating an account, you agree to Royofist's Conditions of Use and Privacy Policy.</p>
          <p>© 2023-2024, Royofist.com, Inc. or its affiliates</p>
        </div>
      </div>
    </div>
  );
}
