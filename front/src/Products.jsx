import React, { useEffect, useState } from 'react';
import { fastcount } from './Redux/totalslice';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import link from './link';

function Products({ data, func, namefunc, pi }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const userdetail = localStorage.getItem('userdetail');
    if (userdetail) {
      const parse = JSON.parse(userdetail);
      const names = parse.name;
      namefunc(names);
    }
  }, [namefunc]);

  function imgclick() {
    pi(data);
    navigate('/productinfo');
  }

  async function cart() {
    const userdetail = localStorage.getItem('userdetail');
    if (!userdetail) {
      alert("Please log in to add products to your cart");
      return;
    }

    const parse = JSON.parse(userdetail);

    try {
      const response = await axios.post(
        `${link}/product/cart`,
        {
          name: data.name,
          category: data.category,
          price: data.price,
          image: data.image,
          uid: parse._id,
        }
      );

      const { message } = response.data;
      if (message === 'f') {
        toast.warn("Product Already Added to Cart");
      } else {
        const count = await axios.get(
          `${link}/product/getcart/${parse._id}`
        );
        dispatch(fastcount());
        func(count.data.length);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 hover:scale-105 flex flex-col justify-between relative h-90"
    >
      <div className="relative cursor-pointer" onClick={imgclick}>
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-48 object-cover transition-transform duration-300 ease-in-out"
        />
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-100 transition-opacity duration-300 ease-in-out"
        >
          <span className="text-white text-lg font-semibold">
            View Product
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">{data.name}</h3>
          <p className="text-yellow-200 font-semibold text-xl mb-2">{data.price}</p>
          <p className="text-sm text-gray-200 mb-4">Category: {data.category}</p>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-md hover:bg-yellow-600 hover:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300"
            onClick={(e) => {
              e.stopPropagation();
              cart();
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;
