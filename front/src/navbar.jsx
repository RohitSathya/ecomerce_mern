import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import royologo from '../images/logo.png';
import locationlogo from '../images/location.png';
import cartstore from '../images/cart.png';
import logoutIcon from '../images/log-out.png';
import link from './link';

export default function Navbar({ count, func, username, selectedCategory, onCategoryChange }) {
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
        const response = await axios.get(`${link}/product/getcart/${parse._id}`)
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
      alert("Please log in to view your orders")
    } else {
      navigate('/order');
    }
  };

  const handleCartClick = () => {
    if (username === 'Guest') {
      alert("Please log in to view your cart")
    } else {
      navigate('/cart');
    }
  };

  const categories = [
    'All',
    'Mobile',
    'Camera',
    'Perfumes',
    'Shoes',
    'Laptops',
    'Headphones',
    'Watches',
    'Accessories',
    'Home Appliances',
    'Kitchen Appliances',
    'Clothing',
    'Beauty Products',
    'Books',
    'Toys',
    'Sports Equipment'
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-3 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <img src={royologo} alt="Logo" className="h-8 sm:h-12 cursor-pointer hidden sm:block" onClick={() => navigate('/')} />
          <div className="hidden lg:flex items-center space-x-2 sm:space-x-3">
            <img src={locationlogo} alt="Location" className="h-5 sm:h-6" />
            <span className="font-semibold text-sm sm:text-base md:text-lg">India Since 2018</span>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg flex items-center">
            <div className="relative hidden md:block">
              <select
                className="appearance-none bg-white text-gray-800 font-semibold py-2 px-3 pr-8 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer text-xs sm:text-sm"
                style={{ minWidth: '140px' }} // Slightly larger width to accommodate longer text
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon icon={faChevronDown} className="absolute top-1/2 transform -translate-y-1/2 right-2 text-gray-800 pointer-events-none" />
            </div>
            <input
              type="text"
              placeholder={`Search ${selectedCategory !== 'All' ? selectedCategory : ''}`.trim()}
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-xs sm:text-sm"
              onChange={(e) => func(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500 h-4 sm:h-5 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 sm:space-x-8">
          <div className="hidden sm:block">
            <span className="font-semibold text-xs sm:text-sm md:text-lg">Hello, {username}</span>
          </div>
          <div className="cursor-pointer font-semibold text-xs sm:text-sm md:text-lg" onClick={handleOrdersClick}>
            Your Orders
          </div>
          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <img src={cartstore} alt="Cart" className="h-5 sm:h-6 md:h-8" />
            {username !== 'Guest' && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] sm:text-[10px] md:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

          {username === 'Guest' ? (
            <div className="cursor-pointer ml-6 sm:ml-8" onClick={() => navigate('/login')}>
              Login
            </div>
          ) : (
            <img src={logoutIcon} alt="Logout" className="h-5 sm:h-6 md:h-8 cursor-pointer ml-6 sm:ml-8" onClick={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
}
