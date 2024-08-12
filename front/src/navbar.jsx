import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import royologo from '../images/logo.png';
import locationlogo from '../images/location.png';
import search from '../images/search.png';
import cartstore from '../images/cart.png';
import logoutIcon from '../images/log-out.png';
import link from './link';

export default function Navbar({ count, func, username }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(count);

  const counter = useSelector((state) => state.total.count);
  const fakecounter = useSelector((state) => state.total.fakecount);
  const fastcount = useSelector((state) => state.total.fastcounte);

  useEffect(() => {
    async function fetchCart() {
      const userdetail = localStorage.getItem('userdetail');
      if (userdetail) {
        const parse = JSON.parse(userdetail);
        const response = await axios.get(`${link}/product/getcart/${parse._id}`);
        const { message } = response.data;

        if (message === 'f') {
          setCartCount(0);
        } else {
          setCartCount(response.data.length);
        }
      }
    }
    fetchCart();
  }, [count, counter, fakecounter, fastcount]);

  const handleLogout = () => {
    localStorage.removeItem('userdetail');
    navigate('/login');
  };
  const handleOrdersClick = () => {
    if (username === 'Guest') {
      alert('Please log in to view your orders.');
    } else {
      navigate('/order');
    }
  };

  const handleCartClick = () => {
    if (username === 'Guest') {
      alert('Please log in to view your cart.');
    } else {
      navigate('/cart');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <img src={royologo} alt="Logo" className="h-8 sm:h-10 cursor-pointer" onClick={() => navigate('/')} />
          <div className="hidden lg:flex items-center space-x-1 sm:space-x-2">
            <img src={locationlogo} alt="Location" className="h-5 sm:h-6" />
            <span className="font-semibold text-xs sm:text-sm md:text-base">India Since 2018</span>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md lg:max-w-lg">
            <input
              type="text"
              placeholder="Search Royofist.in"
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => func(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <img src={search} alt="Search" className="h-5 sm:h-6 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:block">
            <span className="font-semibold text-xs sm:text-sm md:text-lg">Hello, {username}</span>
          </div>
          <div className="cursor-pointer font-semibold text-xs sm:text-sm md:text-lg" onClick={handleOrdersClick}>
            Your Orders
          </div>
          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <img src={cartstore} alt="Cart" className="h-6 sm:h-8 md:h-10" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] sm:text-xs md:text-sm font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          {username === 'Guest' ? (
            <div className="cursor-pointer ml-4" onClick={() => navigate('/login')}>
              Login
            </div>
          ) : (
            <img src={logoutIcon} alt="Logout" className="h-6 sm:h-8 md:h-10 cursor-pointer ml-4" onClick={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
}
