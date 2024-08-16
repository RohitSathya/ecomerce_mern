import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fastcount, postorder } from './Redux/totalslice';
import close from '../images/close.png';
import tick from '../images/tick.png';
import card from '../images/cards.png';
import link from './link';

export default function BuyPage({ data, data2, func }) {
  const [ord, setOrd] = useState(data2);
  const [country, setCountry] = useState('India');
  const [name, setName] = useState('');
  const [pno, setPno] = useState('');
  const [pincode, setPincode] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [savedAdd, setSavedAdd] = useState(null);
  const [isNewUser, setIsNewUser] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [parsetot, setParsetot] = useState(data);
  const [fl, setFl] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpDate, setCardExpDate] = useState('');
  const [cardExpYear, setCardExpYear] = useState('');
  const [upiId, setUpiId] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false); // State to manage success message visibility
  const [paymentMethod, setPaymentMethod] = useState('card'); // Payment method state

  const nav = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAddress = async () => {
      const userdetail = localStorage.getItem('userdetail');
      const parse = JSON.parse(userdetail);
      const response = await axios.get(`${link}/product/getaddress/${parse._id}`);
      const { message, addressofuid } = response.data;

      if (message === 's' && addressofuid) {
        setSavedAdd(addressofuid);
        setIsNewUser(false);
      } else {
        setShowAddressForm(true);
        setIsNewUser(true);
      }
    };

    fetchAddress();

    if (data !== undefined) {
      localStorage.setItem('ordertotal', JSON.stringify(data));
    }
    setParsetot(JSON.parse(localStorage.getItem('ordertotal')));
  }, [data, fl]);

  const handleSaveAddress = async () => {
    const userdetail = localStorage.getItem('userdetail');
    const parse = JSON.parse(userdetail);

    if (isNewUser) {
      await axios.post(link + '/product/address', {
        country,
        name,
        phoneno: pno,
        pincode,
        area,
        landmark,
        uid: parse._id
      });
    } else {
      await axios.put(`${link}/product/updateaddress/${parse._id}/${name}/${pno}/${landmark}/${pincode}/${area}`);
    }
    setFl(fl + 1);
    setShowAddressForm(false);
  };

  const handleEditAddress = () => {
    setShowAddressForm(true);
  };

  const handleCloseForm = () => {
    setShowAddressForm(false);
  };

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      if (/^[0-9]{16}$/.test(cardNumber) && /^[0-9]{2}$/.test(cardExpDate) && cardExpDate >= 1 && cardExpDate <= 12 &&
        /^[0-9]{2}$/.test(cardExpYear) && cardExpYear >= 24 && cardExpYear <= 50) {

        processOrder();
      } else {
        alert('Invalid card details!');
      }
    } else if (paymentMethod === 'upi') {
      if (/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
        processOrder();
      } else {
        alert('Invalid UPI ID!');
      }
    } else if (paymentMethod === 'cod') {
      processOrder();
    }
  };

  const processOrder = async () => {
    const userdetail = localStorage.getItem('userdetail');
    const parse = JSON.parse(userdetail);

    await axios.delete(`${link}/product/dcart/${parse._id}`);
    dispatch(fastcount());
    dispatch(postorder(ord));
    const mm = await axios.post(`${link}/product/order`, { ord });
    const { m } = mm.data;

    if (m === 's') {
      setOrderSuccess(true);
      setTimeout(() => {
        nav('/');
        setOrderSuccess(false);
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-red-900 text-lg mb-4">Order Total: {parsetot}</h2>

      {showAddressForm ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mb-6 relative">
          <img
            src={close}
            alt="Close"
            className="absolute top-4 right-4 w-6 h-6 cursor-pointer"
            onClick={handleCloseForm}
          />
          <h1 className="text-xl font-semibold mb-4">Add/Edit Address</h1>
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700 ">Country/Region</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md text-gray-700"
            >
              <option value="India">India</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
            </select>
            <label className="block text-sm font-medium mb-2 text-gray-700 ">Full Name (First and Last Name)</label>
            <input
              type="text"
              className="w-full p-2 mb-4 border rounded-md text-gray-700 "
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="block text-sm font-medium mb-2 text-gray-700 ">Mobile Number</label>
            <input
              type="text"
              maxLength="10"
              className="w-full p-2 mb-4 border rounded-md text-gray-700 "
              value={pno}
              onChange={(e) => setPno(e.target.value)}
            />
            <label className="block text-sm font-medium mb-2 text-gray-700 ">Pincode</label>
            <input
              type="text"
              maxLength="6"
              className="w-full p-2 mb-4 border rounded-md text-gray-700 "
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <label className="block text-sm font-medium mb-2 text-gray-700 ">Area</label>
            <input
              type="text"
              className="w-full p-2 mb-4 border rounded-md text-gray-700"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            <label className="block text-sm font-medium mb-2 text-gray-700">Landmark</label>
            <input
              type="text"
              maxLength="26"
              className="w-full p-2 mb-4 border rounded-md text-gray-700 "
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
            <button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md"
              onClick={handleSaveAddress}
            >
              Save Address
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Shipping Address</h2>
          <div>
            <p className="text-gray-900"><strong>{savedAdd?.name}</strong></p>
            <p className="text-gray-900">{savedAdd?.area}, {savedAdd?.landmark}</p>
            <p className="text-gray-900">{savedAdd?.pincode}</p>
          </div>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 mt-4 rounded-md"
            onClick={handleEditAddress}
          >
            Edit Address
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Payment Options</h2>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
            />
            <span className="ml-2 text-gray-700">Card Payment</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={() => setPaymentMethod('upi')}
            />
            <span className="ml-2 text-gray-700">UPI Payment</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
            />
            <span className="ml-2 text-gray-700">Cash on Delivery</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl payment" id="payment">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Card Payment Details</h2>
          <label className="block text-sm font-medium mb-2 text-gray-700 ">Card Number</label>
          <input
            type="text"
            maxLength="16"
            className="w-full p-2 mb-4 border rounded-md text-gray-700"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <div className="flex space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Exp Month</label>
              <input
                type="text"
                maxLength="2"
                className="w-full p-2 border rounded-md text-gray-700"
                value={cardExpDate}
                onChange={(e) => setCardExpDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Exp Year</label>
              <input
                type="text"
                maxLength="2"
                className="w-full p-2 border rounded-md text-gray-700"
                value={cardExpYear}
                onChange={(e) => setCardExpYear(e.target.value)}
              />
            </div>
          </div>
          <button
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md"
            onClick={handlePayment}
          >
            Pay and Order
          </button>
          <div className="text-center mt-4">
            <b>Accepted Here</b>
            <img src={card} alt="Accepted Cards" className="mt-2" />
          </div>
        </div>
      )}

      {paymentMethod === 'upi' && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl payment" id="payment">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">UPI Payment Details</h2>
          <label className="block text-sm font-medium mb-2 text-gray-700">UPI ID</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded-md text-gray-700"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
          <button
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md"
            onClick={handlePayment}
          >
            Pay and Order
          </button>
        </div>
      )}

      {paymentMethod === 'cod' && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl payment" id="payment">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Cash on Delivery</h2>
          <p className="text-gray-700 mb-4">
            You can pay for your order when it is delivered to your doorstep.
          </p>
          <button
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md"
            onClick={handlePayment}
          >
            Confirm Order
          </button>
        </div>
      )}

      {orderSuccess && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            textAlign: 'center',
            animation: 'fadeInUp 0.5s ease-out',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'bounce 1s infinite',
            }}
          >
            <img src={tick} alt="Success Tick" style={{ width: '5rem', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#22c55e' }}>
              Your Order Has Been Placed Successfully!
            </h2>
            <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>Thank you for shopping with us!</p>
            <button
              style={{
                marginTop: '1.5rem',
                backgroundColor: '#3b82f6',
                hover: { backgroundColor: '#2563eb' },
                color: 'white',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                outline: 'none',
                cursor: 'pointer',
              }}
              onClick={() => nav('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
