import React from 'react';

export default function Input({
    label,
    id,
    type = 'text',
    error,
    className = '',
    ...props
}) {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-seaal-light focus:ring focus:ring-seaal-light/20 transition-all duration-200 outline-none
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                `}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
