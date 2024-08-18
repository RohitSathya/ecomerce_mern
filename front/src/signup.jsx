import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fastcount } from './Redux/totalslice';
import axios from 'axios';
import link from './link';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import zxcvbn from 'zxcvbn';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneno, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const navid = document.getElementById('navbar');
    if (navid) navid.style.display = 'none';
  }, []);

  useEffect(() => {
    const result = zxcvbn(password);
    setPasswordStrength(result);
  }, [password]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&#]/.test(password)
    );
  };

  async function handleSubmit() {
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      alert('Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character.');
      return;
    }

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

  const passwordStrengthLabel = () => {
    if (!passwordStrength) return '';
    switch (passwordStrength.score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const passwordStrengthColor = () => {
    if (!passwordStrength) return '';
    switch (passwordStrength.score) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            ROYOMART
          </h1>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
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
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <PhoneInput
              country={'in'}
              value={phoneno}
              onChange={setPhoneNo}
              inputStyle={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '10px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                marginTop: '4px',
                color: 'black',
              }}
              containerStyle={{ width: '100%' }}
              buttonStyle={{ backgroundColor: 'white', borderRight: '1px solid #d1d5db' }}
              dropdownStyle={{
                backgroundColor: 'white',
                color: 'black',
                maxHeight: '150px',
                overflowY: 'scroll',
              }}
              enableLongNumbers={true}
              isValid={(value, country) => {
                if (country.countryCode === 'in') {
                  return /^[6-9]\d{9}$/.test(value);
                }
                return true;
              }}
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
              className={`w-full mt-1 px-4 py-2 border ${
                validateEmail(email) ? 'border-green-300' : 'border-red-300'
              } rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
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
              placeholder="Password"
              className={`w-full mt-1 px-4 py-2 border ${
                validatePassword(password) ? 'border-green-300' : 'border-red-300'
              } rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="mt-2 flex items-center">
              <div className={`h-2 w-full rounded-full ${passwordStrengthColor()}`}></div>
              <span className="ml-2 text-sm text-gray-600">{passwordStrengthLabel()}</span>
            </div>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <span className="ml-2 text-gray-700">Show Password</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character.
            </p>
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
            className="py-2 w-full bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
