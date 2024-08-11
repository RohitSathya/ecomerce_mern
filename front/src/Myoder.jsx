import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DisplayOrder from './DisplayOrder';
import link from './link';
export default function MyOrder() {
  const [order, setOrder] = useState([]);
  const [res, setRes] = useState('s');
  const fastcount = useSelector((state) => state.total.fastcounte);

  useEffect(() => {
    const userdetail = localStorage.getItem('userdetail');
    const parse = JSON.parse(userdetail);

    async function getOrder() {
      const response = await axios.get(`${link}/product/getorder/${parse._id}`);
      const { message } = response.data;
      if (message === 'f') {
        setRes('f');
      } else {
        setOrder(response.data);
      }
    }
    getOrder();
  }, [fast]);

  function fast() {}

  return (
    <div className="container mx-auto px-4 py-8">
      {res === 's' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {order.map((o) => (
            <div key={o._id} className="bg-white shadow-md rounded-lg p-4">
              <DisplayOrder data={o} func={fast} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-700">Your Order is Empty!!!</h1>
        </div>
      )}
    </div>
  );
}
