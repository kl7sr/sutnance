import React from 'react';

/**
 * Professional Spinner Component
 * Uses SEAAL brand colors for a cohesive look
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-[#003366] border-t-[#8CC63F] border-r-[#00AEEF] rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
}

/**
 * Full Page Spinner with message
 */
export function LoadingSpinner({ message = 'Chargement...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] gap-4 ${className}`}>
      <Spinner size="lg" />
      <p className="text-[#003366] font-medium text-lg">{message}</p>
    </div>
  );
}
