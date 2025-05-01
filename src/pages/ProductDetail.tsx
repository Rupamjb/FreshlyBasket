import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductById, getRelatedProducts, Product } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import { formatCurrency } from '../utils/currencyUtils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        if (id) {
          // Fetch product details
          const productData = await getProductById(id);
          setProduct(productData);
          
          // Fetch related products
          const related = await getRelatedProducts(id, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
    // Reset the quantity and active tab when product changes
    setQuantity(1);
    setActiveTab('description');
    // Scroll to top
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      try {
        // Calculate discounted price if applicable
        const discountedPrice = product.discountPercentage 
          ? product.price - (product.price * (product.discountPercentage / 100)) 
          : undefined;
        
        // Check if we're using mock data (numeric or short string IDs) 
        // If so, we need to use a valid MongoDB ObjectId for the backend
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(product.id);
        
        // For mock data, map to valid MongoDB IDs
        // In a real app, you'd be getting actual MongoDB IDs from the API
        const productIdMap: Record<string, string> = {
          '1': '65f0c2e55a9a6a5e5c30f8b1',
          '2': '65f0c2e55a9a6a5e5c30f8b2',
          '3': '65f0c2e55a9a6a5e5c30f8b3',
          '4': '65f0c2e55a9a6a5e5c30f8b4',
          '5': '65f0c2e55a9a6a5e5c30f8b5',
          '6': '65f0c2e55a9a6a5e5c30f8b6',
        };
        
        // Use mapped ID if available, otherwise use the original ID (if it's a valid ObjectId)
        const validProductId = productIdMap[product.id] || (isValidObjectId ? product.id : '65f0c2e55a9a6a5e5c30f8b1');
        
        console.log('Using product ID for cart:', validProductId);
        
        // Add to cart with fallback for local storage if API fails
        addToCart({
          productId: validProductId,
          name: product.name,
          price: product.price,
          discountedPrice,
          quantity,
          image: product.images && product.images.length > 0 ? product.images[0] : 'placeholder.jpg',
          category: product.category || 'Uncategorized'
        }).then(() => {
          // Show success message or open mini cart
          const miniCart = document.getElementById('mini-cart');
          if (miniCart) {
            miniCart.classList.add('open');
            setTimeout(() => {
              miniCart.classList.remove('open');
            }, 3000);
          }
        }).catch(err => {
          console.error('Failed to add to cart:', err);
          // Show error toast or notification
        });
      } catch (error) {
        console.error('Error in handleAddToCart:', error);
      }
    }
  };
  
  const incrementQuantity = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }
  
  const discountedPrice = product.discountPercentage 
    ? product.price - (product.price * (product.discountPercentage / 100)) 
    : product.price;
  
  return (
    <div className="container py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-sm text-neutral-600 hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-neutral-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to="/products" className="ml-1 text-sm text-neutral-600 hover:text-primary">
                  Products
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-neutral-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to={`/products/${product.category.toLowerCase()}`} className="ml-1 text-sm text-neutral-600 hover:text-primary">
                  {product.category}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-neutral-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-neutral-500">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      {/* Product main content */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product image */}
          <div className="relative p-6 flex items-center justify-center bg-neutral-50">
            <motion.img 
              src={product.images[0]} 
              alt={product.name}
              className="max-h-[400px] object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Product badges */}
            <div className="absolute top-8 left-8 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                  New
                </span>
              )}
              {product.isOrganic && (
                <span className="bg-secondary text-neutral-800 text-xs px-3 py-1 rounded-full">
                  Organic
                </span>
              )}
              {product.isVegan && (
                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                  Vegan
                </span>
              )}
              {product.discountPercentage && (
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>
          </div>
          
          {/* Product info */}
          <div className="p-8">
            <div className="mb-2 text-sm">
              <span className="text-neutral-600">Category: </span>
              <Link to={`/products/${product.category.toLowerCase()}`} className="text-primary hover:underline">
                {product.category}
              </Link>
              {product.subcategory && (
                <>
                  <span className="mx-2">/</span>
                  <Link to={`/products/${product.subcategory.toLowerCase()}`} className="text-primary hover:underline">
                    {product.subcategory}
                  </Link>
                </>
              )}
            </div>
            
            <h1 className="text-3xl font-heading font-bold text-neutral-800 mb-3">{product.name}</h1>
            
            {/* Rating */}
            {product.averageRating && (
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 ${star <= Math.round(product.averageRating || 0) ? 'text-yellow-400' : 'text-neutral-300'}`}
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-neutral-600">{product.averageRating.toFixed(1)} / 5.0</span>
              </div>
            )}
            
            {/* Price */}
            <div className="mb-6">
              {product.discountPercentage ? (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-primary">{formatCurrency(discountedPrice)}</span>
                  <span className="ml-2 text-lg text-neutral-500 line-through">{formatCurrency(product.price)}</span>
                  <span className="ml-2 text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    Save {product.discountPercentage}%
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-primary">{formatCurrency(product.price)}</span>
              )}
              <p className="text-sm text-neutral-500 mt-1">Price per {product.unit}</p>
            </div>
            
            {/* Stock status */}
            <div className="mb-6">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                product.stockQuantity > 10 
                  ? 'bg-green-100 text-green-800' 
                  : product.stockQuantity > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {product.stockQuantity > 10 
                  ? 'In Stock' 
                  : product.stockQuantity > 0 
                    ? `Only ${product.stockQuantity} left` 
                    : 'Out of Stock'}
              </span>
            </div>
            
            {/* Short description */}
            <p className="text-neutral-600 mb-8">
              {product.description}
            </p>
            
            {/* Quantity selector and Add to cart */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-neutral-300 rounded-md">
                <button 
                  onClick={decrementQuantity} 
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-neutral-600 hover:text-primary disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= (product.stockQuantity || 99)) {
                      setQuantity(val);
                    }
                  }} 
                  className="w-12 text-center border-x border-neutral-300 py-2 focus:outline-none"
                />
                <button 
                  onClick={incrementQuantity} 
                  disabled={product.stockQuantity ? quantity >= product.stockQuantity : false}
                  className="px-3 py-2 text-neutral-600 hover:text-primary disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart} 
                disabled={product.stockQuantity === 0}
                className="btn btn-primary py-3 px-6 flex-grow md:flex-grow-0"
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Product tabs */}
        <div className="border-t border-neutral-200">
          <div className="flex border-b border-neutral-200">
            <button 
              onClick={() => setActiveTab('description')} 
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'description' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-neutral-600 hover:text-primary'
              }`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('nutrition')} 
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'nutrition' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-neutral-600 hover:text-primary'
              }`}
            >
              Nutritional Info
            </button>
            <button 
              onClick={() => setActiveTab('reviews')} 
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'reviews' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-neutral-600 hover:text-primary'
              }`}
            >
              Reviews
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-3">Product Description</h3>
                <p className="text-neutral-600 mb-4">{product.description}</p>
                
                {product.ingredients && (
                  <div className="mb-4">
                    <h4 className="font-medium text-neutral-800 mb-2">Ingredients:</h4>
                    <ul className="list-disc pl-5 text-neutral-600">
                      {product.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                    <div className="p-3 bg-primary bg-opacity-10 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-neutral-800">Fresh Guaranteed</h5>
                      <p className="text-sm text-neutral-600">Delivered with freshness</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                    <div className="p-3 bg-primary bg-opacity-10 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-neutral-800">Fast Delivery</h5>
                      <p className="text-sm text-neutral-600">Within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                    <div className="p-3 bg-primary bg-opacity-10 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-neutral-800">Quality Assurance</h5>
                      <p className="text-sm text-neutral-600">100% guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'nutrition' && (
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-4">Nutritional Information</h3>
                
                {product.nutritionalInfo ? (
                  <div className="bg-neutral-50 p-5 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                        <h4 className="text-neutral-500 text-sm mb-1">Calories</h4>
                        <p className="text-xl font-semibold text-neutral-800">{product.nutritionalInfo.calories}</p>
                        <span className="text-xs text-neutral-500">kcal per 100g</span>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                        <h4 className="text-neutral-500 text-sm mb-1">Protein</h4>
                        <p className="text-xl font-semibold text-neutral-800">{product.nutritionalInfo.protein}g</p>
                        <span className="text-xs text-neutral-500">per 100g</span>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                        <h4 className="text-neutral-500 text-sm mb-1">Carbs</h4>
                        <p className="text-xl font-semibold text-neutral-800">{product.nutritionalInfo.carbs}g</p>
                        <span className="text-xs text-neutral-500">per 100g</span>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                        <h4 className="text-neutral-500 text-sm mb-1">Fat</h4>
                        <p className="text-xl font-semibold text-neutral-800">{product.nutritionalInfo.fat}g</p>
                        <span className="text-xs text-neutral-500">per 100g</span>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-sm text-neutral-500">
                      * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                    </p>
                  </div>
                ) : (
                  <p className="text-neutral-600">Nutritional information not available for this product.</p>
                )}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-4">Customer Reviews</h3>
                
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-b-0">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium text-neutral-800">{review.user}</h4>
                          <span className="text-neutral-500 text-sm">{review.date}</span>
                        </div>
                        <div className="flex text-yellow-400 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg 
                              key={star} 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-neutral-300'}`} 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-neutral-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h4 className="text-lg font-medium text-neutral-700 mb-2">No Reviews Yet</h4>
                    <p className="text-neutral-500 max-w-md mx-auto">
                      Be the first to review this product and help other shoppers with your feedback.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-neutral-800">Related Products</h2>
            <Link to="/products" className="text-primary hover:underline">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name ?? ''}
                price={product.price}
                image={product.image ?? ''}
                category={product.category}
                discountPercentage={product.discountPercentage}
                isOrganic={product.isOrganic}
                isVegan={product.isVegan}
                isNew={product.isNew}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail; 