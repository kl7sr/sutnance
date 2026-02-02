import React from 'react';

/**
 * Primary Button Component
 * Uses seaal-dark color with smooth hover effects
 */
export function PrimaryButton({ children, onClick, type = 'button', disabled = false, className = '', ...props }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                px-6 py-3 
                bg-[#003366] 
                text-white 
                font-semibold 
                rounded-lg 
                shadow-md 
                transition-all 
                duration-300 
                ease-in-out
                hover:bg-[#002244] 
                hover:shadow-lg 
                hover:scale-[1.02] 
                active:scale-[0.98] 
                disabled:opacity-50 
                disabled:cursor-not-allowed 
                disabled:hover:scale-100
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}

/**
 * Success Button Component
 * Uses seaal-green color for publishing/confirming actions
 */
export function SuccessButton({ children, onClick, type = 'button', disabled = false, className = '', ...props }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                px-6 py-3 
                bg-[#8CC63F] 
                text-white 
                font-semibold 
                rounded-lg 
                shadow-md 
                transition-all 
                duration-300 
                ease-in-out
                hover:bg-[#7AB82E] 
                hover:shadow-lg 
                hover:scale-[1.02] 
                active:scale-[0.98] 
                disabled:opacity-50 
                disabled:cursor-not-allowed 
                disabled:hover:scale-100
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}
