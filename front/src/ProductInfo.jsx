import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fastcount } from './Redux/totalslice';
import features from '../images/features.png';
import link from './link';

export default function ProductInfo({ data }) {
  const dispatch = useDispatch();
  const [ati, setati] = useState(data.ati);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when the component is mounted
  }, []);

  async function addToCart() {
    const userdetail = localStorage.getItem('userdetail');
    
    if (!userdetail) {
      alert('Please log in to add products to your cart.');
      return;
    }
    
    const parse = JSON.parse(userdetail);
    const response = await axios.post(`${link}/product/cart`, {
      name: data.name,
      category: data.category,
      price: data.price,
      image: data.image,
      uid: parse._id,
    });
    
    const { message } = response.data;
    if (message === 'f') {
      alert('Product already added to cart');
    } else {
      await axios.get(`${link}/product/getcart/${parse._id}`);
      dispatch(fastcount());
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:items-start bg-white p-4 md:p-8 gap-8 md:gap-16">
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-md"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{data.name}</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">{data.description}</p>
        <div className="flex items-center mb-4">
          <b className="text-2xl text-yellow-500 mr-2">{data.rating}</b>
          <img src={data.ratingimg} alt="Rating" className="h-6" />
        </div>
        <div className="mb-4 text-gray-600 font-semibold">
          <b>{data.pur}</b>
        </div>
        <div className="border-b border-gray-300 mb-4"></div>
        <div className="mb-4">
          <b className="text-4xl text-red-600">{data.dis}</b>
        </div>
        <div className="mb-4">
          <b className="text-3xl text-gray-900">${data.price}</b>
        </div>
        <div className="text-gray-500 text-sm mb-4">
          <p>MRP: $ {data.mrp}</p>
        </div>
        <div className="border-b border-gray-300 mb-4"></div>
        <div className="text-gray-700 font-medium text-lg mb-6">
          <p>Including all taxes</p>
        </div>
        <div className="mb-6">
          <img src={features} alt="Features" className="w-full h-auto object-contain" />
        </div>
        <div className="text-xl font-semibold mb-4">About this item</div>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-6">
          {ati.map((a, index) => (
            <li key={index} className="mb-2">{a}</li>
          ))}
        </ul>
        <button
          onClick={addToCart}
          className="w-full md:w-1/2 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
