import React from 'react';
import axios from 'axios';
import { fastcount } from './Redux/totalslice';
import { useDispatch } from 'react-redux';
import link from './link';
export default function DisplayOrder({ data, func }) {
  const dispatch = useDispatch();

  async function cancel() {
    const userdetail = localStorage.getItem('userdetail');
    const parse = JSON.parse(userdetail);
    const response = await axios.delete(`${link}/product/deleteorder/${parse._id}/${data._id}`);
    const { message } = response.data;
    if (message === 's') {
      dispatch(fastcount());
      func();
    }
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 rounded-lg shadow p-4">
      <div className="w-full h-56 overflow-hidden rounded-md mb-4">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-contain"
          style={{ maxHeight: '100%' }}
        />
      </div>
      <div className="flex flex-col items-center text-center">
        <b className="text-lg font-semibold mb-2">{data.name}</b>
        <b className="text-lg text-gray-700 mb-2">{data.price}</b>
        <b className="text-md text-gray-500 mb-4">Category: {data.category}</b>
      </div>
      <div className="text-center mb-4">
        <b className="text-orange-600 text-lg">Arriving at Wednesday</b>
        <b className="text-orange-600 text-sm">By 9PM</b>
      </div>
      <button
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md"
        onClick={cancel}
      >
        Cancel Order
      </button>
    </div>
  );
}
