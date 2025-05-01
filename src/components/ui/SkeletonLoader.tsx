import React from 'react';

interface SkeletonProps {
  className?: string;
}

// Basic skeleton with shimmer effect
export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-neutral-200 animate-pulse rounded ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  </div>
);

// Product card skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="product-card bg-white rounded-md overflow-hidden shadow-sm border border-gray-200" style={{ height: '320px' }}>
    {/* Image placeholder */}
    <Skeleton className="w-full h-[160px]" />
    
    {/* Content placeholders */}
    <div className="p-3 h-[160px] flex flex-col justify-between">
      <div>
        <Skeleton className="h-3 w-16 mb-2" /> {/* Category */}
        <Skeleton className="h-5 w-full mb-1" /> {/* Title line 1 */}
        <Skeleton className="h-5 w-3/4 mb-4" /> {/* Title line 2 */}
      </div>
      <div>
        <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
          <Skeleton className="h-5 w-16" /> {/* Price */}
          <Skeleton className="h-7 w-12 rounded-sm" /> {/* Button */}
        </div>
      </div>
    </div>
  </div>
);

// Product grid skeleton (multiple cards)
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
    {Array(count).fill(0).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Text skeleton for paragraphs
export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array(lines).fill(0).map((_, index) => (
      <Skeleton 
        key={index} 
        className={`h-4 ${index === lines - 1 ? 'w-4/5' : 'w-full'}`} 
      />
    ))}
  </div>
);

// Header skeleton
export const HeaderSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4 mx-auto" />
    <Skeleton className="h-4 w-1/2 mx-auto" />
  </div>
);

// Button skeleton
export const ButtonSkeleton: React.FC = () => (
  <Skeleton className="h-10 w-full rounded-md" />
);

export default {
  Skeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  TextSkeleton,
  HeaderSkeleton,
  ButtonSkeleton
}; 