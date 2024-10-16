import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fastcount } from './Redux/totalslice';
import { FaShippingFast, FaRegCheckCircle, FaRegCreditCard, FaStar, FaTrash } from 'react-icons/fa';
import { BiSupport } from 'react-icons/bi';
import link from './link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import ReactStars from 'react-rating-stars-component';

export default function ProductInfo({ data }) {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState(() => {
    return data && Object.keys(data).length > 0 ? data : JSON.parse(localStorage.getItem('productData'));
  });
  const [mainImage, setMainImage] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const userDetail = localStorage.getItem('userdetail');
    if (userDetail) {
      const parse = JSON.parse(userDetail);
      setUserId(parse.uid || parse._id);
      setUsername(parse.displayName || parse.name);
    }
    fetchComments();
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      localStorage.setItem('productData', JSON.stringify(data));
      setProductData(data);
      setMainImage(Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : data.image);
    } else {
      const storedData = localStorage.getItem('productData');
      if (storedData && storedData !== '{}') {
        const parsedData = JSON.parse(storedData);
        setProductData(parsedData);
        setMainImage(Array.isArray(parsedData.images) && parsedData.images.length > 0 ? parsedData.images[0] : parsedData.image);
      }
    }

    window.scrollTo(0, 0);

    return () => {
      localStorage.removeItem('productData');
    };
  }, [data]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${link}/comments/get/${productData._id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast.warn('Please enter a comment');
      return;
    }

    const commentPayload = {
      userId,
      username,
      comment: newComment,
      productId: productData._id,
    };

    try {
      const response = await axios.post(`${link}/comments/add`, commentPayload);
      setComments([response.data, ...comments]);  // Append new comment to the list
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      // Include userId as a query parameter
      const response = await axios.delete(`${link}/comments/delete/${commentId}?userId=${userId}`);
      setComments(comments.filter(comment => comment._id !== commentId)); // Remove deleted comment from the list
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error deleting comment');
    }
  };
  

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const addToCart = async () => {
    if (!productData || Object.keys(productData).length === 0) {
      toast.warn("No product data available.");
      return;
    }

    const userdetail = localStorage.getItem('userdetail');
    if (!userdetail) {
      toast.warn("Please log in to add products to your cart");
      return;
    }
    const parse = JSON.parse(userdetail);
    let userId;
    // Determine whether the user signed in via Google (uid) or normal sign-in (_id)
    if (parse.uid) {
      userId = parse.uid;
    } else if (parse._id) {
      userId = parse._id;
    }

    try {
      const response = await axios.post(`${link}/product/cart`, {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        image: mainImage,
        uid: userId,
      });
      const { message } = response.data;
      if (message === 'f') {
        toast.warn('Product already added to cart');
      } else {
        await axios.get(`${link}/product/getcart/${userId}`);
        dispatch(fastcount());
      }
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  if (!productData || Object.keys(productData).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-center items-start bg-white p-4 md:p-8 gap-8 md:gap-16">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex flex-row md:flex-col mb-4 space-x-2 md:space-x-0 md:space-y-2">
            {Array.isArray(productData.images) && productData.images.map((image, index) => (
              <div 
                key={index} 
                className="w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-md cursor-pointer border border-gray-200 hover:border-blue-500 transition-all duration-200"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`object-cover w-full h-full ${mainImage === image ? 'border-blue-500' : 'border-transparent'}`}
                />
              </div>
            ))}
          </div>
          <div className="w-full max-w-[400px] max-h-[400px] flex justify-center items-center overflow-hidden bg-white">
            <InnerImageZoom
              src={mainImage}
              zoomSrc={mainImage}
              alt={productData.name}
              className="object-contain w-full h-auto"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{productData.name}</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">{productData.description}</p>
          <div className="flex items-center mb-4">
            <b className="text-2xl text-yellow-500 mr-2">{productData.rating}</b>
            <ReactStars
              count={5}
              value={productData.rating}
              size={24}
              edit={false}  // Makes the stars read-only
              activeColor="#ffd700"  // Star color
              isHalf={true}  // Enables half-star display
            />
            <span>({productData.rating.count} reviews)</span> {/* Display the review count */}
          </div>
          <div className="mb-4 text-gray-600 font-semibold">
            <b>{productData.pur}</b>
          </div>
          <div className="border-b border-gray-300 mb-4"></div>
          <div className="mb-4">
            <b className="text-4xl text-red-600">{productData.dis}%</b>
          </div>
          <div className="mb-4">
            <b className="text-3xl text-gray-900">{productData.price} USD</b>
          </div>
          <div className="text-gray-500 text-sm mb-4">
            <p className="line-through">MRP: {productData.mrp} USD</p>
          </div>
          <div className="border-b border-gray-300 mb-4"></div>
          <div className="text-gray-700 font-medium text-lg mb-6">
            <p>Including all taxes</p>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-4 text-center">
            <div>
              <BiSupport size={40} className="mx-auto text-orange-500" />
              <p className="mt-2 text-sm text-gray-700">7 days service center</p>
            </div>
            <div>
              <FaShippingFast size={40} className="mx-auto text-orange-500" />
              <p className="mt-2 text-sm text-gray-700">Free delivery</p>
            </div>
            <div>
              <FaRegCheckCircle size={40} className="mx-auto text-orange-500" />
              <p className="mt-2 text-sm text-gray-700">Warranty policy</p>
            </div>
            <div>
              <FaRegCreditCard size={40} className="mx-auto text-orange-500" />
              <p className="mt-2 text-sm text-gray-700">Pay on delivery</p>
            </div>
            <div>
              <FaStar size={40} className="mx-auto text-orange-500" />
              <p className="mt-2 text-sm text-gray-700">Top brand</p>
            </div>
          </div>
          <div className="text-xl font-semibold mb-4">About this item</div>
          <ul className="list-disc list-inside text-lg text-gray-700 mb-6">
            {productData.ati && productData.ati.map((a, index) => (
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

      {/* Comment Section */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        
        {userId ? (
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-md mb-2 text-black"
              placeholder="Leave a comment..."
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        ) : (
          <p className="text-red-500 mb-4">Please sign in to leave a comment</p>
        )}

        {/* Display comments */}
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={index}
              className="mb-4 p-6 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <p className="font-semibold text-xl text-indigo-900 mr-2">{comment.username}</p>
                  <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                {comment.userId === userId && (
                  <button
                    onClick={() => handleCommentDelete(comment._id)}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <p className="text-base text-gray-700 leading-relaxed">{comment.comment}</p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </>
  );
}
