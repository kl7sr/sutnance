import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
            ],
            refresh: true,
        }),
    ],
    server: {
        host: true,
        port: 5173,
        hmr: {
            host: 'localhost',
        },
        proxy: {
            // proxy storage & API to your Laravel backend during dev
            '/storage': 'http://127.0.0.1:8000',
            '/api': 'http://127.0.0.1:8000',
        },
    },
});