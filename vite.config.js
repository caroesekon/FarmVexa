import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import seoFiles from 'vite-plugin-seo-files';

export default defineConfig({
    plugins: [
        react(),
        seoFiles({
            siteUrl: 'https://farmvexa.hdm.co.ke',
        }),
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});