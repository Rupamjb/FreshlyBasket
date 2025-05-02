import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { getProducts, Product } from '../services/productService';
import { motion } from 'framer-motion';
import { FiClock, FiChevronRight, FiMapPin } from 'react-icons/fi';
import { initSmoothScroll, preventScrollJank, setupLazyLoading } from '../utils/smoothScroll';
import '../utils/scrollOptimizations.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [organicProducts, setOrganicProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Setup scroll jank prevention and get cleanup function
    const cleanupScrollJank = preventScrollJank();
    
    // Setup lazy loading for images
    setupLazyLoading();
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Get products for different sections
        const [vegetablesResult, newResult, organicResult] = await Promise.all([
          getProducts('vegetables', undefined, 12), // Increased from 4 to 12 products
          getProducts(undefined, undefined, 6),
          getProducts(undefined, undefined, 6)
        ]);
        
        // Apply safe filtering with fallbacks
        setFeaturedProducts(vegetablesResult.products || []);
        
        // Filter new products safely
        const newProds = newResult.products || [];
        setNewProducts(newProds.filter(p => p.isNew === true));
        
        // Filter organic products safely 
        const organicProds = organicResult.products || [];
        setOrganicProducts(organicProds.filter(p => p.isOrganic === true));
        
      } catch (error) {
        console.error('Error fetching products:', error);
        // Set empty arrays as fallback
        setFeaturedProducts([]);
        setNewProducts([]);
        setOrganicProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Clean up on unmount
    return () => {
      cleanupScrollJank();
    };
  }, []);

  return (
    <div ref={homeRef} className="min-h-screen bg-gray-50 scroll-container">
      {/* Delivery Location Bar - Only visible on desktop */}
      <div className="hidden md:block sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <FiMapPin className="text-primary" />
            <span className="text-sm font-medium">Deliver to: <span className="font-bold">Guwahati, 781001</span></span>
          </div>
          <div className="flex items-center space-x-2 bg-[#f0f7f2] px-3 py-1 rounded-full">
            <FiClock className="text-primary" />
            <span className="text-sm"><span className="font-bold text-primary">20 mins</span> delivery</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-neutral-100 overflow-hidden hero-section">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Hero Content */}
            <div className="w-full md:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight text-neutral-800">
                  DISCOVER TRUE <br />
                  <span className="text-primary">HEALTH & WELLNESS</span>
                </h1>
                <p className="text-lg text-neutral-600 max-w-lg">
                  Fresh organic vegetables and groceries delivered to your doorstep. 
                  High-quality, locally sourced products for a healthier lifestyle.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/products" 
                    className="btn btn-primary px-6 py-3 rounded-lg"
                  >
                    Shop Now
                  </Link>
                  <Link 
                    to="/about" 
                    className="btn bg-white text-primary border border-primary hover:bg-neutral-100 px-6 py-3 rounded-lg"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Hero Image */}
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden shadow-xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce" 
                  alt="Fresh produce" 
                  className="w-full h-[300px] md:h-[400px] object-cover"
                  loading="eager" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 content-container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">Shop by Category</h2>
            <Link to="/products" className="text-primary text-sm font-medium flex items-center">
              View All <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { 
                name: 'Vegetables',
                image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7',
                color: 'from-green-500/20'
              },
              { 
                name: 'Fruits',
                image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
                color: 'from-red-500/20'
              },
              { 
                name: 'Dairy',
                image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da',
                color: 'from-blue-500/20'
              },
              { 
                name: 'Bakery',
                image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec',
                color: 'from-yellow-500/20'
              },
              { 
                name: 'Groceries',
                image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58',
                color: 'from-purple-500/20'
              },
              { 
                name: 'Offers',
                image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f',
                color: 'from-pink-500/20'
              }
            ].map((category, index) => (
              <Link 
                key={index} 
                to={`/products/${category.name.toLowerCase()}`}
                className="flex flex-col items-center text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full aspect-square rounded-2xl overflow-hidden relative transition-shadow duration-300 group-hover:shadow-lg"
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} z-10`}></div>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover absolute inset-0"
                  />
                </motion.div>
                <span className="text-sm font-medium text-neutral-800 mt-3 group-hover:text-primary transition-colors duration-200">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 content-container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">Featured Products</h2>
            <Link to="/products" className="text-primary text-sm font-medium flex items-center">
              View All <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 5).map(product => (
                  <ProductCard 
                    key={product.id || product._id} 
                    {...product}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No featured products available. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Shop By Ethics Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 content-container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">Shop By Ethics</h2>
            <Link to="/products/ethics" className="text-primary text-sm font-medium flex items-center">
              See All <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                name: 'Certified Organic', 
                image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2'
              },
              { 
                name: 'Eco-Friendly', 
                image: 'https://images.unsplash.com/photo-1586162545148-70922ecb5a0e'
              },
              { 
                name: 'Plastic Free', 
                image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9'
              },
              { 
                name: 'Vegan', 
                image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf'
              }
            ].map((item, index) => (
              <Link 
                key={index} 
                to={`/products/ethics/${item.name.toLowerCase().replace(' ', '-')}`}
                className="group block relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-full h-full"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <h3 className="text-white font-medium text-xl p-6 w-full">{item.name}</h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 content-container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">New Arrivals</h2>
            <Link to="/products?filter=new" className="text-primary text-sm font-medium flex items-center">
              See All <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {newProducts.length > 0 ? (
                newProducts.map(product => (
                  <ProductCard 
                    key={product.id || product._id}
                    {...product}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No new products available. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Organic Products Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 content-container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">Organic Products</h2>
            <Link to="/products?filter=organic" className="text-primary text-sm font-medium flex items-center">
              See All <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {organicProducts.length > 0 ? (
                organicProducts.map(product => (
                  <ProductCard 
                    key={product.id || product._id}
                    {...product}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No organic products available. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 