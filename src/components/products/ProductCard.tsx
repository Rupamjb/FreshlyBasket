import { useState, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/currencyUtils';

// Fallback image as base64 data URL (small gray placeholder with product icon)
const FALLBACK_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmMGYwZjAiLz4KPHBhdGggZD0iTTc1IDY1IEwxMjUgNjUgTDEyNSAxMzUgTDc1IDEzNSBaIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNNjUgODUgTDEzNSA4NSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+";

interface ProductCardProps {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
  category: string;
  discountPercentage?: number;
  isOrganic?: boolean;
  isVegan?: boolean;
  isNew?: boolean;
  stock?: number;
  unit?: string;
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  id,
  _id,
  name,
  price,
  image,
  imageUrl,
  category,
  discountPercentage,
  isOrganic = false,
  isNew = false,
  stock,
  unit
}) => {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Use either image or imageUrl, with imageUrl taking precedence if both exist
  useEffect(() => {
    // Set the initial image source
    const initialImage = imageUrl || image || '';
    setImageSrc(initialImage);
    
    // Pre-load the image to check if it's valid
    if (initialImage) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(initialImage);
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.warn(`Failed to load product image: ${initialImage}`);
        setImageSrc(FALLBACK_IMAGE);
        setImageLoaded(true);
      };
      img.src = initialImage;
    } else {
      // No image provided, use fallback
      setImageSrc(FALLBACK_IMAGE);
      setImageLoaded(true);
    }
  }, [image, imageUrl]);
  
  // Use either id or _id, with _id taking precedence
  const productId = _id || id || '';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (stock !== undefined && stock === 0) return;
    
    try {
      setIsAddingToCart(true);
      setAddError(null);
      
      // Calculate discounted price if applicable
      const discountedPrice = discountPercentage 
        ? price - (price * (discountPercentage / 100)) 
        : undefined;
      
      // Check if ID is a valid MongoDB ObjectId
      const isValidObjectId = productId && /^[0-9a-fA-F]{24}$/.test(productId);
      
      if (!isValidObjectId) {
        console.warn(`Invalid product ID format: ${productId}`);
      }
      
      // Add to cart with all required fields
      await addToCart({
        productId: productId,
        name,
        price,
        discountedPrice,
        quantity: 1,
        image: imageSrc,
        category,
        unit: unit || 'item'
      });

      // Show a temporary success indicator
      const button = document.getElementById(`add-btn-${productId}`);
      if (button) {
        button.classList.add('bg-green-500');
        setTimeout(() => {
          button.classList.remove('bg-green-500');
        }, 1000);
      }
      
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      setAddError(error instanceof Error ? error.message : 'Failed to add to cart');
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setAddError(null);
      }, 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const discountedPrice = discountPercentage 
    ? price - (price * (discountPercentage / 100)) 
    : price;

  return (
    <motion.div 
      className="bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-200 w-full"
      style={{ height: '320px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
    >
      <Link to={`/product/${productId}`} className="flex-1 flex flex-col h-full">
        {/* Fixed-height product image container */}
        <div className="relative w-full h-[160px] overflow-hidden bg-gray-50">
          <motion.img 
            src={imageSrc} 
            alt={name} 
            loading="lazy"
            className={`w-full h-full object-contain transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.warn(`Error loading image for ${name}`);
              setImageSrc(FALLBACK_IMAGE);
              setImageLoaded(true);
            }}
          />
          
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#0F5132] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-medium"
              >
                New
              </motion.span>
            )}
            {isOrganic && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#E6B118] text-neutral-800 text-[10px] px-1.5 py-0.5 rounded-sm font-medium"
              >
                Organic
              </motion.span>
            )}
            {discountPercentage && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-medium"
              >
                -{discountPercentage}%
              </motion.span>
            )}
          </div>
        </div>
        
        {/* Fixed-height product info area */}
        <div className="p-3 flex-1 flex flex-col justify-between h-[160px]">
          <div>
            <div className="text-[10px] font-medium text-neutral-500 mb-1 capitalize">{category}</div>
            <h3 className="text-sm font-medium text-neutral-800 mb-1 line-clamp-2 h-[40px]">{name}</h3>
            
            {/* Weight/Unit */}
            {unit && (
              <div className="text-[10px] text-neutral-500">
                {unit}
              </div>
            )}
          </div>
          
          {/* Price and Add Button - Fixed layout */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              {discountPercentage ? (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#0F5132]">{formatCurrency(discountedPrice)}</span>
                  <span className="text-[10px] text-neutral-500 line-through">{formatCurrency(price)}</span>
                </div>
              ) : (
                <span className="text-sm font-semibold text-[#0F5132]">{formatCurrency(price)}</span>
              )}
            </div>
            
            <motion.button 
              id={`add-btn-${productId}`}
              onClick={handleAddToCart}
              disabled={stock !== undefined && stock === 0 || isAddingToCart}
              whileTap={{ scale: 0.95 }}
              className={`
                min-w-[50px] h-[28px] text-[10px] font-bold
                ${stock !== undefined && stock === 0 
                  ? 'bg-neutral-200 text-neutral-500' 
                  : 'bg-[#0F5132] text-white hover:bg-[#0D4328]'
                } 
                rounded-sm px-2 uppercase transition-colors
              `}
            >
              {stock !== undefined && stock === 0 
                ? 'Out'
                : isAddingToCart 
                  ? '...' 
                  : 'ADD'}
            </motion.button>
          </div>
          
          {/* Error message */}
          {addError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-1 text-[10px] text-red-500 text-center"
            >
              {addError}
            </motion.div>
          )}
        </div>
      </Link>
    </motion.div>
  );
});

export default ProductCard; 