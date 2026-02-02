import React from 'react';

/**
 * Skeleton Screen Component
 * Professional loading placeholder matching SEAAL brand
 */
export function Skeleton({ className = '', width = 'w-full', height = 'h-4' }) {
  return (
    <div
      className={`${width} ${height} bg-gray-200 rounded-lg animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Announcement Card Skeleton with Glassmorphism
 * Mimics the structure of an announcement card in grid layout
 */
export function AnnonceCardSkeleton() {
  return (
    <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/30 overflow-hidden">
      {/* Left Gradient Accent Skeleton */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-[#003366] to-[#00AEEF] opacity-50"
      />
      
      <div className="ml-3">
        {/* Title Skeleton */}
        <Skeleton width="w-3/4" height="h-6" className="mb-4" />
        
        {/* Content Skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton height="h-3" />
          <Skeleton height="h-3" />
          <Skeleton width="w-5/6" height="h-3" />
        </div>
        
        {/* Footer Skeleton */}
        <div className="pt-4 border-t border-gray-200/50 flex items-center gap-4">
          <Skeleton width="w-24" height="h-3" />
          <Skeleton width="w-20" height="h-3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Multiple Announcement Cards Skeleton in Grid Layout
 */
export function AnnonceListSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <AnnonceCardSkeleton key={index} />
      ))}
    </div>
  );
}
