import React, { useState, useEffect } from 'react';
import axios from 'axios';
import link from './link'; // Adjust this to your server URL

export default function AdminPanel() {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productRating, setProductRating] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productMRP, setProductMRP] = useState('');
  const [productDiscount, setProductDiscount] = useState('');
  const [productPurchaseInfo, setProductPurchaseInfo] = useState('');
  const [productIngredients, setProductIngredients] = useState('');
  const [productAttributes, setProductAttributes] = useState(['']);
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${link}/pro/all`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleAddProduct = async () => {
    const newProduct = {
      name: productName,
      category: productCategory,
      price: productPrice,
      image: productImage,
      description: productDescription,
      brand: productBrand,
      rating: productRating,
      count: productCount,
      mrp: productMRP,
      dis: productDiscount,
      pur: productPurchaseInfo,
      t: productIngredients.split(',').map(item => item.trim()), // Assuming ingredients are comma separated
      ati: productAttributes.filter(attr => attr.trim() !== ''), // Filtering out empty attributes
    };

    try {
      if (editProductId) {
        await axios.put(`${link}/pro/update/${editProductId}`, newProduct);
        setEditProductId(null);
      } else {
        const response = await axios.post(`${link}/pro/add`, newProduct);
        setProducts([...products, response.data]);
      }
      resetForm();
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error adding/updating product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditProductId(product._id);
    setProductName(product.name);
    setProductCategory(product.category);
    setProductPrice(product.price);
    setProductImage(product.image);
    setProductDescription(product.description);
    setProductBrand(product.brand);
    setProductRating(product.rating);
    setProductCount(product.count);
    setProductMRP(product.mrp);
    setProductDiscount(product.dis);
    setProductPurchaseInfo(product.pur);
    setProductIngredients(product.t.join(', '));
    setProductAttributes(product.ati);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${link}/pro/delete/${productId}`);
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setProductName('');
    setProductCategory('');
    setProductPrice('');
    setProductImage('');
    setProductDescription('');
    setProductBrand('');
    setProductRating(0);
    setProductCount(0);
    setProductMRP('');
    setProductDiscount('');
    setProductPurchaseInfo('');
    setProductIngredients('');
    setProductAttributes(['']);
    setEditProductId(null);
  };

  const handleAttributeChange = (index, value) => {
    const newAttributes = [...productAttributes];
    newAttributes[index] = value;
    setProductAttributes(newAttributes);
  };

  const handleAddAttribute = () => {
    setProductAttributes([...productAttributes, '']);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Admin Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded text-black bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded text-black bg-white"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800 transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-700">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-gray-700">Price</label>
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-gray-700">Image URL</label>
          <input
            type="text"
            value={productImage}
            onChange={(e) => setProductImage(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-gray-700">Brand</label>
          <input
            type="text"
            value={productBrand}
            onChange={(e) => setProductBrand(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-gray-700">Rating</label>
          <input
            type="number"
            value={productRating}
            onChange={(e) => setProductRating(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
            min="0" max="5"
          />
          <label className="block text-gray-700">Count</label>
          <input
            type="number"
            value={productCount}
            onChange={(e) => setProductCount(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-gray-700">MRP</label>
          <input
            type="text"
            value={productMRP}
            onChange={(e) => setProductMRP(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-gray-700">Discount</label>
          <input
            type="text"
            value={productDiscount}
            onChange={(e) => setProductDiscount(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-gray-700">Purchase Info</label>
          <input
            type="text"
            value={productPurchaseInfo}
            onChange={(e) => setProductPurchaseInfo(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-gray-700">Attributes</label>
          {productAttributes.map((attribute, index) => (
            <input
              key={index}
              type="text"
              value={attribute}
              onChange={(e) => handleAttributeChange(index, e.target.value)}
              className="w-full p-2 mb-2 border rounded text-black bg-white"
              placeholder="Add an attribute"
            />
          ))}
          <button
            className="mt-2 bg-green-500 text-white p-2 rounded"
            onClick={handleAddAttribute}
          >
            Add Another Attribute
          </button>
          <button
            className="mt-4 bg-blue-500 text-white p-2 rounded"
            onClick={handleAddProduct}
          >
            {editProductId ? 'Update Product' : 'Add Product'}
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Products List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, index) => (
              <div key={index} className="border rounded p-4 shadow-lg bg-white text-black">
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-4" />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p>{product.price}</p>
                <p>{product.category}</p>
                <p>{product.brand}</p>
                <p>Rating: {product.rating}</p>
                <div className="flex mt-4">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
