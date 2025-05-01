import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { getProducts, getCategories, Product } from '../services/productService';
import { ProductGridSkeleton } from '../components/ui/SkeletonLoader';
import PageTransition from '../components/ui/PageTransition';
import { formatCurrency } from '../utils/currencyUtils';
import { FiFilter, FiX } from 'react-icons/fi';

const ProductListing = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const productsPerPage = 12;
  
  // Observer for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category || undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [showOrganic, setShowOrganic] = useState(false);
  const [showVegan, setShowVegan] = useState(false);
  const [sortOption, setSortOption] = useState('featured');

  // Prevent body scroll when filter drawer is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileFiltersOpen]);
  
  // Fetch categories once on initial load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch products when filters or search changes
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        
        // Reset products when filters change
        setProducts([]);
        
        const result = await getProducts(
          selectedCategory, 
          searchQuery, 
          productsPerPage, 
          1
        );
        
        setProducts(result.products);
        setTotalProducts(result.total);
        setHasMore(result.products.length < result.total);
        
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialProducts();
  }, [selectedCategory, searchQuery, priceRange, showOrganic, showVegan, sortOption]);
  
  // Fetch more products for infinite scrolling
  useEffect(() => {
    const fetchMoreProducts = async () => {
      // Skip first page (already loaded) and don't fetch if we don't have more products
      if (currentPage === 1 || !hasMore) return;
      
      try {
        setLoadingMore(true);
        
        const result = await getProducts(
          selectedCategory, 
          searchQuery, 
          productsPerPage, 
          currentPage
        );
        
        // Append new products to existing ones
        setProducts(prevProducts => [...prevProducts, ...result.products]);
        setHasMore(products.length + result.products.length < result.total);
        
      } catch (error) {
        console.error('Error fetching more products:', error);
      } finally {
        setLoadingMore(false);
      }
    };
    
    fetchMoreProducts();
  }, [currentPage]);
  
  // Apply client-side filters
  useEffect(() => {
    // Apply client-side filters
    let result = [...products];
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by organic
    if (showOrganic) {
      result = result.filter(product => product.isOrganic);
    }
    
    // Filter by vegan
    if (showVegan) {
      result = result.filter(product => product.isVegan);
    }
    
    // Sort products
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // 'featured' - no specific sort
        break;
    }
    
    setFilteredProducts(result);
  }, [products, priceRange, showOrganic, showVegan, sortOption]);
  
  const handleCategoryChange = (cat: string | undefined) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    setProducts([]);
    setMobileFiltersOpen(false);
    window.scrollTo(0, 0);
  };
  
  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };
  
  const handleResetFilters = () => {
    setSelectedCategory(undefined);
    setPriceRange([0, 100]);
    setShowOrganic(false);
    setShowVegan(false);
    setSortOption('featured');
    setCurrentPage(1);
    setProducts([]);
    window.scrollTo(0, 0);
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const applyFilters = () => {
    setMobileFiltersOpen(false);
  };
  
  // Filter drawer component for mobile
  const FilterDrawer = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${mobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          <button 
            onClick={toggleMobileFilters} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          {/* Categories filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-neutral-700">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleCategoryChange(undefined)} 
                  className={`text-left w-full hover:text-[#0F5132] ${!selectedCategory ? 'font-medium text-[#0F5132]' : 'text-neutral-700'}`}
                >
                  All Products
                </button>
              </li>
              {categories.map((cat, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleCategoryChange(cat.toLowerCase())} 
                    className={`text-left w-full hover:text-[#0F5132] ${selectedCategory === cat.toLowerCase() ? 'font-medium text-[#0F5132]' : 'text-neutral-700'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Price range filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-neutral-700">Price Range</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-neutral-700">{formatCurrency(priceRange[0])}</span>
              <span className="text-neutral-700">{formatCurrency(priceRange[1])}</span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={100} 
              value={priceRange[1]} 
              onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])} 
              className="w-full accent-[#0F5132]"
            />
          </div>
          
          {/* Dietary preferences */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-neutral-700">Dietary Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showOrganic} 
                  onChange={() => setShowOrganic(!showOrganic)} 
                  className="rounded text-[#0F5132] focus:ring-[#0F5132]"
                />
                <span className="text-neutral-700">Organic</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showVegan} 
                  onChange={() => setShowVegan(!showVegan)} 
                  className="rounded text-[#0F5132] focus:ring-[#0F5132]"
                />
                <span className="text-neutral-700">Vegan</span>
              </label>
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-white pt-2 pb-4 flex space-x-3">
            <button 
              onClick={handleResetFilters}
              className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors rounded-md font-medium"
            >
              Reset
            </button>
            <button 
              onClick={applyFilters}
              className="flex-1 py-2.5 px-4 bg-[#0F5132] text-white hover:bg-[#0D4328] transition-colors rounded-md font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <PageTransition type="fade">
      <div className="container py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">
          {selectedCategory 
            ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` 
            : searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : 'All Products'}
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter button */}
          <div className="lg:hidden flex items-center mb-4">
            <button
              onClick={toggleMobileFilters}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white shadow-sm text-sm text-gray-700"
            >
              <FiFilter className="h-4 w-4" />
              <span>Filters</span>
              {(showOrganic || showVegan || selectedCategory || priceRange[1] < 100) && (
                <span className="w-5 h-5 bg-[#0F5132] text-white text-xs flex items-center justify-center rounded-full">
                  {(showOrganic ? 1 : 0) + (showVegan ? 1 : 0) + (selectedCategory ? 1 : 0) + (priceRange[1] < 100 ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
          
          {/* Mobile filter drawer */}
          <FilterDrawer />
          
          {/* Desktop sidebar filters - hidden on mobile */}
          <div className="hidden lg:block w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <h2 className="text-xl font-heading font-semibold mb-6 pb-2 border-b border-gray-100 text-[#0F5132]">Filters</h2>
              
              {/* Categories filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-neutral-700">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => handleCategoryChange(undefined)} 
                      className={`text-left w-full hover:text-[#0F5132] ${!selectedCategory ? 'font-medium text-[#0F5132]' : 'text-neutral-700'}`}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map((cat, index) => (
                    <li key={index}>
                      <button 
                        onClick={() => handleCategoryChange(cat.toLowerCase())} 
                        className={`text-left w-full hover:text-[#0F5132] ${selectedCategory === cat.toLowerCase() ? 'font-medium text-[#0F5132]' : 'text-neutral-700'}`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Price range filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-neutral-700">Price Range</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-neutral-700">{formatCurrency(priceRange[0])}</span>
                  <span className="text-neutral-700">{formatCurrency(priceRange[1])}</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={100} 
                  value={priceRange[1]} 
                  onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])} 
                  className="w-full accent-[#0F5132]"
                />
              </div>
              
              {/* Dietary preferences */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-neutral-700">Dietary Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showOrganic} 
                      onChange={() => setShowOrganic(!showOrganic)} 
                      className="rounded text-[#0F5132] focus:ring-[#0F5132]"
                    />
                    <span className="text-neutral-700">Organic</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showVegan} 
                      onChange={() => setShowVegan(!showVegan)} 
                      className="rounded text-[#0F5132] focus:ring-[#0F5132]"
                    />
                    <span className="text-neutral-700">Vegan</span>
                  </label>
                </div>
              </div>
              
              {/* Reset filters */}
              <button 
                onClick={handleResetFilters}
                className="w-full py-2.5 px-4 bg-[#0F5132] text-white hover:bg-[#0D4328] transition-colors rounded-md font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Product grid */}
          <div className="w-full lg:w-3/4">
            {/* Sorting and results count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-neutral-600 mb-3 sm:mb-0">
                {loading ? 'Loading products...' : `Showing ${filteredProducts.length} of ${totalProducts} products`}
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-neutral-600">Sort by:</label>
                <select 
                  id="sort" 
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border-neutral-300 rounded-md focus:ring-[#0F5132] focus:border-[#0F5132]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
            
            {loading && filteredProducts.length === 0 ? (
              <ProductGridSkeleton count={productsPerPage} />
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-neutral-700 mb-2">No products found</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  We couldn't find any products matching your filters. Try adjusting your filters or explore our other categories.
                </p>
                <button 
                  onClick={handleResetFilters}
                  className="mt-6 px-4 py-2.5 bg-[#0F5132] text-white rounded-md hover:bg-[#0D4328] transition-colors font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredProducts.map((product, index) => {
                    const isLastElement = index === filteredProducts.length - 1;
                    
                    return (
                      <div 
                        key={product.id} 
                        ref={isLastElement ? lastProductElementRef : null}
                        className="flex justify-center w-full"
                      >
                        <ProductCard 
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          image={product.images[0]}
                          category={product.category}
                          discountPercentage={product.discountPercentage}
                          isOrganic={product.isOrganic}
                          isVegan={product.isVegan}
                          isNew={product.isNew}
                          unit={product.unit}
                        />
                      </div>
                    );
                  })}
                </div>
                
                {/* Loading more indicator */}
                {loadingMore && (
                  <div className="flex justify-center mt-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F5132]"></div>
                  </div>
                )}
                
                {/* End of results message */}
                {!hasMore && filteredProducts.length > 0 && (
                  <div className="text-center mt-8 text-neutral-500">
                    You've reached the end of the results
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductListing;