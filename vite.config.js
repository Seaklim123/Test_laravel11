import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        cors: true,
        origin: 'https://62a3-175-100-102-162.ngrok-free.app',
        allowedHosts: ['62a3-175-100-102-162.ngrok-free.app'],
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
});
