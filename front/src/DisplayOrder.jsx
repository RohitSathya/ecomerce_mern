import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fastcount } from './Redux/totalslice';
import link from './link';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function DisplayOrder({ data, func }) {
  const dispatch = useDispatch();
  const [arrivalDate, setArrivalDate] = useState('');

  useEffect(() => {
    // Calculate the arrival date (2 days from today)
    const calculateArrivalDate = () => {
      const today = new Date();
      const twoDaysFromNow = new Date(today);
      twoDaysFromNow.setDate(today.getDate() + 2);

      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      const formattedDate = twoDaysFromNow.toLocaleDateString(undefined, options);
      setArrivalDate(formattedDate);
    };

    calculateArrivalDate();
  }, []);

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

  function showConfirmDialog() {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={styles.confirmBox}>
            <h2 style={styles.title}>Confirm to Cancel</h2>
            <p style={styles.message}>Are you sure you want to cancel this order?</p>
            <div style={styles.buttonContainer}>
              <button
                style={styles.yesButton}
                onClick={() => {
                  cancel();
                  onClose();
                }}
              >
                Yes, Cancel it
              </button>
              <button
                style={styles.noButton}
                onClick={onClose}
              >
                No, Keep it
              </button>
            </div>
          </div>
        );
      }
    });
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
      <div className="text-center mb-4 space-y-2">
        <b className="text-orange-600 text-lg block">Arriving on {arrivalDate}</b>
        <b className="text-orange-600 text-sm block">By 9PM</b>
      </div>  
      <button
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md"
        onClick={showConfirmDialog}
      >
        Cancel Order
      </button>
    </div>
  );
}

const styles = {
  confirmBox: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    borderRadius: '8px',
    padding: '20px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  message: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  yesButton: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  noButton: {
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};
