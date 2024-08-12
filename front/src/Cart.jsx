import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartDisplay from './CartDisplay';
import { addTotal, fastcount, getcount, removeqty, reset } from './Redux/totalslice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import greentick from '../images/greentick.png';
import link from './link';
export default function Cart({ func, funce }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxtotal = useSelector((state) => state.total.total).toFixed(2);
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [fl, setFl] = useState(0);
  const [ry, setRy] = useState(0);

  useEffect(() => {
    async function getCart() {
      try {
        const userdetail = localStorage.getItem('userdetail');
        const parse = JSON.parse(userdetail);
        const response = await axios.get(`${link}/product/getcart/${parse._id}`);
        if (response.data.length !== undefined) {
          setCart(response.data);
          setCount(response.data.length);

          const totalPrice = response.data.reduce((acc, item) => {
            const itemPrice = parseFloat(item.price.replace(' USD'));
            return acc + itemPrice;
          }, 0);
          setTotal(totalPrice.toFixed(2));
        } else {
          setTotal(0);
          setFl(0);
          dispatch(fastcount());
          setRy(1);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getCart();
  }, [count, dispatch]);

  function getQty(index, price, qty) {
    qty -= 1;
    const prices = parseFloat(price.replace(' USD'));
    const multiplyQtyPrice = prices * qty;
    dispatch(addTotal({ prevtotal: total, index, mul: multiplyQtyPrice }));
    setFl(1);
  }

  async function deleteCart(e, index) {
    const userdetail = localStorage.getItem('userdetail');
    const parse = JSON.parse(userdetail);
    const deleteResponse = await axios.delete(`${link}/product/deletecart/${parse._id}/${e}`);
    if (deleteResponse.data.message === 's') {
      const response = await axios.get(`${link}/product/getcart/${parse._id}`);
      setCart(response.data);
      setCount(response.data.length);

      const totalPrice = response.data.reduce((acc, item) => {
        const itemPrice = parseFloat(item.price.replace(' USD'));
        return acc + itemPrice;
      }, 0) || 0;
      setTotal(totalPrice.toFixed(2));
      setFl(0);
      dispatch(getcount(response.data.length));
      localStorage.removeItem(`savedqty${index}`);
      dispatch(reset());
      dispatch(removeqty({ index, val: 0 }));
    }
  }

  async function buy() {
    if ((total === 0 && reduxtotal === 0) || ry === 1) {
      alert('Your cart is empty. Cannot proceed to payment page.');
    } else {
      const userdetail = localStorage.getItem('userdetail');
      const parse = JSON.parse(userdetail);
      const response = await axios.get(`${link}/product/getcart/${parse._id}`);
      func(fl === 0 ? total : reduxtotal);
      funce(response.data);
      navigate('/buy');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <img src={greentick} alt="Green Tick" className="w-4 h-4" />
          <b className="text-green-700 text-sm">Your order is eligible for FREE Delivery.</b>
        </div>
        <div className="flex justify-between items-center mb-4">
          <b className="text-lg font-medium text-gray-700">Subtotal ({count} items): $</b>
          <b className="text-xl font-bold text-gray-900 ">{fl === 0 ? total : reduxtotal}</b>
        </div>
        <button
          className="w-full py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500"
          onClick={buy}
        >
          Proceed to Buy
        </button>
      </div>

      <div className="mt-6 w-full max-w-4xl overflow-y-auto bg-white rounded-lg shadow-lg p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {cart.length > 0 ? (
          cart.map((c, index) => (
            <CartDisplay key={index} data={c} func={getQty} ke={index} deletes={deleteCart} />
          ))
        ) : (
          <h1 className="text-center mt-20 text-xl">Your Cart is Empty! Add Something</h1>
        )}
      </div>
    </div>
  );
}
