import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiMenu, FiChevronDown, FiX, FiSearch, FiMapPin, FiNavigation, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useAuthModals } from '../auth/AuthModals';
import styled from 'styled-components';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Guwahati');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { openLogin } = useAuthModals();
  const navigate = useNavigate();
  const location = useLocation();
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const announcements = [
    "Free Delivery on All Orders",
    "Luxurious and Ethical Lifestyle Marketplace",
    "Certified Organic and Natural Products",
    "Exquisite Local Products, Best in Quality"
  ];

  const locationOptions = [
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Dima Hasao",
    "Goalpara",
    "Golaghat",
    "Guwahati",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara-Mankachar",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    // Only close mobile menu when pathname changes, not search params
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  // Focus search input when mobile search opens
  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Show a brief loading indicator in the search field
      const currentQuery = searchQuery;
      setSearchQuery('Searching...');
      
      // Log the search query for debugging
      console.log('Searching for:', currentQuery.trim());
      
      // Navigate to the products page with search query parameter
      // Make sure to properly encode the search string
      const encodedQuery = encodeURIComponent(currentQuery.trim());
      navigate(`/products?search=${encodedQuery}`);
      
      // After a short delay, restore the original query
      setTimeout(() => {
        setSearchQuery(currentQuery);
      }, 300);
      
      // Close mobile search if it's open
      setMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    setLocationDropdownOpen(false);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would make an API call to reverse geocode these coordinates
          // For demo purposes, we'll simulate an API call with a timeout
          const { latitude, longitude } = position.coords;
          console.log(`Got coordinates: ${latitude}, ${longitude}`);
          
          // Simulate a successful API response after a delay
          setTimeout(() => {
            // For this demo, we'll just pick a district close to center of Assam as if we reversed geocoded
            setSelectedLocation("Nagaon");
            setIsLocating(false);
            setLocationDropdownOpen(false);
          }, 1500);
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          setIsLocating(false);
          
          // Show more helpful error messages based on the error code
          switch(error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access was denied. Please enable location services in your browser settings or select a location manually.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable. Please select a location manually.");
              break;
            case error.TIMEOUT:
              alert("Location request timed out. Please try again or select a location manually.");
              break;
            default:
              alert("Could not detect your location. Please select manually.");
          }
        },
        { 
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please select a location manually.");
    }
  };

  // Helper function to check if a link is currently active
  const isActive = (path: string) => {
    if (path === "/") {
      // HOME should only be active when exactly at root
      return location.pathname === "/";
    }
    if (path === '/products' && location.pathname === '/products') {
      return true;
    }
    return location.pathname.startsWith(path);
  };
  
  // Categories for navigation
  const categories = [
    { path: "/", label: "HOME" },
    { path: "/products/vegetables", label: "VEGETABLES" },
    { path: "/products/fruits", label: "FRUITS" },
    { path: "/products/dairy", label: "DAIRY" },
    { path: "/products/bakery", label: "BAKERY" },
    { path: "/products/spices", label: "SPICES" },
    { path: "/products/organic", label: "ORGANIC" },
    { path: "/products/offers", label: "OFFERS" },
  ];

  return (
    <>
      <header className="bg-white shadow-header sticky top-0 z-50">
        {/* Top announcement bar */}
        <div className="bg-primary text-white text-center py-2 relative h-[36px] overflow-hidden">
          <div className="container">
            <div className="announcement-container relative">
              {announcements.map((text, index) => (
                <p 
                  key={index} 
                  className={`text-sm font-medium absolute transition-all duration-700 w-full left-0 top-0 ${
                    index === announcementIndex 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main navbar */}
        <div className="container py-4">
          <div className="flex justify-between items-center">
            {/* Mobile menu button - only visible on small screens */}
            <button 
              className="md:hidden flex items-center text-neutral-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <LogoContainer>
                  <LogoTextGreen>Freshly</LogoTextGreen>
                  <LogoTextYellow>Basket</LogoTextYellow>
                </LogoContainer>
              </Link>
              
              {/* Location Selector - Only visible on desktop */}
              <div className="hidden md:block ml-4 relative" ref={locationDropdownRef}>
                <button 
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="flex items-center text-sm text-neutral-800 hover:text-primary transition-colors"
                >
                  <FiMapPin className="w-4 h-4 mr-1 text-primary" />
                  <span className="font-medium max-w-[120px] truncate">{selectedLocation}</span>
                  <FiChevronDown className={`w-4 h-4 ml-1 transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Location Dropdown */}
                {locationDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md py-2 z-50 w-56">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <button
                        onClick={detectLocation}
                        disabled={isLocating}
                        className="flex items-center w-full text-left text-sm font-medium text-primary hover:bg-neutral-50 rounded-md px-2 py-1.5"
                      >
                        {isLocating ? (
                          <>
                            <div className="w-4 h-4 mr-2 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                            <span>Detecting location...</span>
                          </>
                        ) : (
                          <>
                            <FiNavigation className="w-4 h-4 mr-2" />
                            <span>Detect my location</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {locationOptions.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => handleLocationSelect(loc)}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            selectedLocation === loc ? 'bg-neutral-100 text-primary font-medium' : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Search bar - hidden on mobile */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search for products, brands and more" 
                  className="w-full py-2 px-4 pl-4 pr-10 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            
            {/* Mobile search icon */}
            <button 
              className="md:hidden text-neutral-800"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Search"
            >
              <FiSearch className="h-5 w-5" />
            </button>
            
            {/* User menu and cart */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Join as Seller Button */}
              <div className="hidden md:block">
                <Link
                  to="/seller/register"
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Join as Seller
                </Link>
              </div>
              
              <div className="hidden sm:block relative">
                {user ? (
                  <Link 
                    to="/profile"
                    className="flex flex-col items-center text-neutral-800 hover:text-primary transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs mt-1">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>
                ) : (
                  <button 
                    onClick={openLogin}
                    className="flex flex-col items-center text-neutral-800 hover:text-primary transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs mt-1">Login</span>
                  </button>
                )}
              </div>
              
              <div className="relative">
                <Link to="/cart" className="flex flex-col items-center text-neutral-800 hover:text-primary transition-colors duration-200">
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-1">Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile search - only shown when search is toggled */}
        {mobileSearchOpen && (
          <div className="md:hidden container px-4 pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search products..." 
                className="w-full py-2 px-4 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* Mobile Location Bar - Only visible on mobile and tablet */}
        <div className="md:hidden bg-white border-t border-b border-gray-100">
          <div className="container px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiMapPin className="text-primary" />
                <div>
                  <div className="text-sm font-medium text-neutral-600">Deliver to:</div>
                  <div className="font-bold text-neutral-800">{selectedLocation}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2 bg-[#f0f7f2] px-3 py-1 rounded-full">
                  <FiClock className="text-primary" />
                  <span className="text-sm"><span className="font-bold text-primary">20 mins</span> delivery</span>
                </div>
                <button
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="text-primary text-sm font-medium flex items-center gap-1"
                >
                  Change
                  <FiChevronDown className={`transition-transform duration-200 ${locationDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Mobile Location Dropdown */}
            {locationDropdownOpen && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <button
                  onClick={detectLocation}
                  disabled={isLocating}
                  className="flex items-center space-x-2 text-primary font-medium w-full hover:bg-gray-50 rounded px-2 py-2 mb-2"
                >
                  <FiNavigation className={isLocating ? 'animate-spin' : ''} />
                  <span>{isLocating ? 'Detecting...' : 'Detect My Location'}</span>
                </button>
                <div className="max-h-48 overflow-y-auto">
                  {locationOptions.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => handleLocationSelect(loc)}
                      className={`w-full text-left px-2 py-2 text-sm hover:bg-gray-50 ${
                        selectedLocation === loc ? 'text-primary font-medium' : 'text-neutral-600'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile menu - only shown when menu is toggled */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-200 py-4">
            <div className="container">
              <nav className="flex flex-col space-y-4">
                {categories.map((category, index) => (
                  <Link 
                    key={index}
                    to={category.path} 
                    className={`px-3 py-2 relative overflow-hidden transition-all duration-500 ease-in-out ${
                      isActive(category.path) 
                        ? "text-primary font-medium border-l-4 border-primary pl-4" 
                        : "text-neutral-800 hover:text-primary hover:pl-4 border-l-4 border-transparent"
                    }`}
                  >
                    {category.label}
                  </Link>
                ))}
                
                {/* Join as Seller for Mobile */}
                <Link 
                  to="/seller/register"
                  className="px-3 py-2 text-primary font-medium hover:pl-4 transition-all duration-500 ease-in-out border-l-4 border-transparent"
                >
                  JOIN AS SELLER
                </Link>
                
                {user ? (
                  <>
                    <Link 
                      to="/profile"
                      className="px-3 py-2 text-neutral-800 hover:text-primary hover:pl-4 transition-all duration-500 ease-in-out text-left sm:hidden"
                    >
                      MY PROFILE
                    </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-2 text-neutral-800 hover:text-primary hover:pl-4 transition-all duration-500 ease-in-out text-left sm:hidden"
                  >
                    LOGOUT
                  </button>
                  </>
                ) : (
                  <button 
                    onClick={openLogin}
                    className="px-3 py-2 text-neutral-800 hover:text-primary hover:pl-4 transition-all duration-500 ease-in-out text-left sm:hidden"
                  >
                    LOGIN / SIGNUP
                  </button>
                )}
              </nav>
            </div>
          </div>
        )}
        
        {/* Desktop Navigation categories - hidden on mobile */}
        <nav className="hidden md:block bg-white border-t border-neutral-200">
          <div className="container relative">
            <div className="flex py-3 gap-x-4 lg:gap-x-8 justify-center no-scrollbar">
              {categories.map((category, index) => (
                <Link 
                  key={index}
                  to={category.path} 
                  className={`relative px-3 py-2 whitespace-nowrap flex-shrink-0 font-medium transition-all duration-500 ease-in-out ${
                    isActive(category.path) 
                      ? "text-primary" 
                      : "text-neutral-800 hover:text-primary"
                  }`}
                >
                  {category.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-500 ease-in-out ${
                    isActive(category.path) ? "scale-x-100" : "scale-x-0 hover:scale-x-100"
                  }`}></span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const LogoTextGreen = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F5132;
  font-family: 'Montserrat', sans-serif;
`;

const LogoTextYellow = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #E6B118;
  font-family: 'Montserrat', sans-serif;
`;

export default Header; 