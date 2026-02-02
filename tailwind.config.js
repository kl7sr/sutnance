import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                seaal: {
                    dark: '#003366',      // Deep Sea Blue
                    light: '#00AEEF',     // Water Blue
                    green: '#8CC63F',     // Accent Green
                    gray: '#F4F7F9',      // Background Gray
                }
            },
            fontFamily: {
                sans: ['Instrument Sans', 'Inter', ...defaultTheme.fontFamily.sans],
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
            },
        },
    },

    plugins: [forms],
};
