import React from 'react';
import { motion } from 'framer-motion';

/**
 * Base Skeleton Component with Shimmer Effect
 * Professional loading placeholder with framer-motion shimmer animation
 */
export function Skeleton({ className = '', width = 'w-full', height = 'h-4' }) {
  return (
    <div
      className={`${width} ${height} bg-gray-200 rounded-lg overflow-hidden relative ${className}`}
      aria-hidden="true"
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

/**
 * Announcement Card Skeleton with Glassmorphism
 * Mimics the structure of an announcement card in masonry grid layout
 */
export function AnnonceCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/40 overflow-hidden break-inside-avoid mb-6"
    >
      {/* Left Gradient Accent Skeleton */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-[#003366] to-[#00AEEF] opacity-50"
      />
      
      {/* Shimmer Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <div className="ml-3 relative z-10">
        {/* Date Badge Skeleton */}
        <div className="absolute top-4 right-4">
          <Skeleton width="w-20" height="h-6" className="rounded-full" />
        </div>
        
        {/* Title Skeleton */}
        <Skeleton width="w-3/4" height="h-6" className="mb-4" />
        
        {/* Content Skeleton */}
        <div className="space-y-2 mb-6 pr-16">
          <Skeleton height="h-3" />
          <Skeleton height="h-3" />
          <Skeleton width="w-5/6" height="h-3" />
          <Skeleton width="w-4/6" height="h-3" />
        </div>
        
        {/* FAB Button Skeleton */}
        <div className="absolute bottom-6 right-6">
          <Skeleton width="w-14" height="h-14" className="rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Multiple Announcement Cards Skeleton in Masonry Grid Layout
 */
export function AnnonceListSkeleton({ count = 6 }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <AnnonceCardSkeleton key={index} />
      ))}
    </div>
  );
}
