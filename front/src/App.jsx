import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import Products from './Products';
import Cart from './Cart';
import Login from './login';
import Signup from './signup';
import BuyPage from './BuyPage';
import MyOrder from './Myoder';
import ProductInfo from './ProductInfo';
import AdminPanel from './AdminPanel';
import ProtectedRoute from './ProtectedRoute';
import link from './link'; // Assume this is your backend URL
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import threepoint5 from '../images/3.5.png';
import four from '../images/4.0.png';
import fourpoint5 from '../images/4.5.png';
import five from '../images/5.0.png';
import AdminOrderPanel from './AdminOrderPanel';
import AdminChatPanel from './AdminChatPanel';

// Mapping rating images
const ratingImages = {
  5: five,
  4.5: fourpoint5,
  4: four,
  3.5: threepoint5,
};

function Banner() {
  const bannerImages = [
    {
      src: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?fit=crop&w=1500&q=80',
      alt: 'High-Tech Products',
      text: 'Discover the Best High-Tech Products',
    },
    {
      src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fit=crop&w=1500&q=80',
      alt: 'Quality Electronics',
      text: 'Top Quality Electronics for Your Needs',
    },
    {
      src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?fit=crop&w=1500&q=80',
      alt: 'Latest Gadgets',
      text: 'Find the Latest Gadgets Here',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // 3 seconds
    fade: true,
    arrows: false,
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
      <Slider {...settings}>
        {bannerImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center">
                {image.text}
              </h2>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

function AppContent() {
  const [buyprice, setBuyprice] = useState();
  const [count, setCount] = useState();
  const [username, setUsername] = useState('Guest');
  const [buydata, setBuydata] = useState([]);
  const [productinfo, setProductinfo] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('default'); // Add sorting state

  const location = useLocation();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${link}/pro/all`);
        const backendProducts = response.data.map(product => {
          let ratingImage = null;
          if (product.rating >= 5) {
            ratingImage = ratingImages[5];
          } else if (product.rating >= 4.5) {
            ratingImage = ratingImages[4.5];
          } else if (product.rating >= 4) {
            ratingImage = ratingImages[4];
          } else if (product.rating >= 3.5) {
            ratingImage = ratingImages[3.5];
          }
          return {
            ...product,
            ratingimg: ratingImage,
          };
        });
        setFilteredProducts([...backendProducts]);
        setUploadedProducts(backendProducts);
      } catch (error) {
        console.error('Error fetching products from backend:', error);
      }
    };

    fetchProducts();
  }, []);

  // Filter and Sort products
  useEffect(() => {
    let filtered = [...uploadedProducts].filter(p => 
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      (searchText === '' || p.name.toLowerCase().includes(searchText.toLowerCase()))
    );

    // Sort products based on selected sort order
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [searchText, selectedCategory, sortOrder, uploadedProducts]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value); // Update the sorting state
  };

  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/admin' || location.pathname === '/adminop' || location.pathname === '/admincp';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-800 text-white">
      {!hideNavbar && (
        <>
          <Navbar 
            count={count} 
            func={handleSearch} 
            username={username} 
            selectedCategory={selectedCategory} 
            onCategoryChange={handleCategoryChange} 
          />
          {/* Display the banner only on the homepage */}
          {location.pathname === '/' && <Banner />}
        </>
      )}
      <div className="container mx-auto px-4 py-8">
        {/* Conditionally render Sorting Dropdown only on the '/' route */}
        {location.pathname === '/' && (
          <div className="mb-4">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="bg-white text-black py-2 px-4 rounded-md"
            >
              <option value="default">Default</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map((p) => (
                  <Products key={p._id || p.name} data={p} func={setCount} namefunc={setUsername} pi={setProductinfo} />
                ))}
              </div>
            }
          />
          <Route path="/cart" element={<ProtectedRoute element={<Cart func={setBuyprice} funce={setBuydata} />} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/adminop" element={<AdminOrderPanel />} />
          <Route path="/admincp" element={<AdminChatPanel />} />
          <Route path="/buy" element={<ProtectedRoute element={<BuyPage data={buyprice} func={setCount} data2={buydata} />} />} />
          <Route path="/order" element={<ProtectedRoute element={<MyOrder />} />} />
          <Route path="/productinfo" element={<ProductInfo data={productinfo} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
