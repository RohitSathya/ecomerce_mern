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
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  async function handleSubmit() {
    if (email === 'admin' && password === '1234') {
      navigate('/admin');
    } else {
      try {
        const response = await axios.post(link + '/product/login', { email, password });
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
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            ROYOMART
          </h1>
          <p className="text-gray-700 mt-2 text-lg">Sign in to continue to your account</p>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
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
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="showPassword"
              className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700">
              Show Password
            </label>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-md shadow-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Sign In
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-lg">New here?</p>
          <button
            onClick={() => navigate('/signup')}
            className="mt-2 py-3 w-full border border-gray-300 text-indigo-600 font-semibold rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Create an Account
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="py-3 w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
          >
            Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}
