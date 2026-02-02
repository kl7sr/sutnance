import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', noPadding = false, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden ${className}`}
            {...props}
        >
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
        </motion.div>
    );
}
