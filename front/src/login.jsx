import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fastcount } from './Redux/totalslice';
import axios from 'axios';
import link from './link';
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  async function handleSubmit() {
    try {
      const response = await axios.post(link+'/product/login', { email, password });
      const { message, userdetail } = response.data;
      if (message === 'failed') {
        alert('Incorrect email or password');
      } else {
        localStorage.setItem('userdetail', JSON.stringify(userdetail));
        dispatch(fastcount());
        navigate('/');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 transform transition-all hover:scale-105 hover:shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to continue to your account</p>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
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
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600">New here?</p>
          <button
            onClick={() => navigate('/signup')}
            className="mt-2 py-3 w-full border border-gray-300 text-indigo-600 font-semibold rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
