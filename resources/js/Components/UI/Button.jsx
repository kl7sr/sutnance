import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    onClick,
    ...props
}) {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl";

    const variants = {
        primary: "bg-seaal-dark text-white hover:bg-opacity-90 focus:ring-seaal-dark shadow-soft",
        secondary: "bg-seaal-light text-white hover:bg-opacity-90 focus:ring-seaal-light shadow-soft",
        outline: "border-2 border-seaal-dark text-seaal-dark hover:bg-seaal-gray focus:ring-seaal-dark",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-seaal-dark",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            type={type}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    );
}
