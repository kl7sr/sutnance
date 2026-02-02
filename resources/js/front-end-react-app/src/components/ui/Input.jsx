import React from 'react';

/**
 * Form Input Component
 * Styled input with rounded-lg and focus ring matching seaal-light
 */
export function Input({ 
    label, 
    name, 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    required = false, 
    error = null,
    className = '',
    ...props 
}) {
    return (
        <div className="w-full">
            {label && (
                <label 
                    htmlFor={name} 
                    className="block text-sm font-semibold text-[#003366] mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`
                    w-full 
                    px-4 
                    py-3 
                    bg-gray-100 
                    border-2 
                    border-transparent 
                    rounded-lg 
                    outline-none 
                    transition-all 
                    duration-300 
                    ease-in-out 
                    focus:bg-white 
                    focus:border-[#00AEEF] 
                    focus:ring-2 
                    focus:ring-[#00AEEF] 
                    focus:ring-opacity-20
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20' : ''}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}

/**
 * Textarea Component
 * Styled textarea with rounded-lg and focus ring matching seaal-light
 */
export function Textarea({ 
    label, 
    name, 
    value, 
    onChange, 
    placeholder, 
    required = false, 
    error = null,
    rows = 4,
    className = '',
    ...props 
}) {
    return (
        <div className="w-full">
            {label && (
                <label 
                    htmlFor={name} 
                    className="block text-sm font-semibold text-[#003366] mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                rows={rows}
                className={`
                    w-full 
                    px-4 
                    py-3 
                    bg-gray-100 
                    border-2 
                    border-transparent 
                    rounded-lg 
                    outline-none 
                    transition-all 
                    duration-300 
                    ease-in-out 
                    focus:bg-white 
                    focus:border-[#00AEEF] 
                    focus:ring-2 
                    focus:ring-[#00AEEF] 
                    focus:ring-opacity-20
                    resize-none
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20' : ''}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}
