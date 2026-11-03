import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import seoFiles from 'vite-plugin-seo-files';
import prerenderStatic from 'vite-plugin-prerender-static';

export default defineConfig({
  plugins: [
    react(),
    seoFiles({
      siteUrl: 'https://farmvexa.hdm.co.ke',
    }),
    prerenderStatic({
      routes: [
        {
          path: '/',
          tags: {
            title: 'FarmVexa - AI-Powered Farm Intelligence',
            description:
              'See. Sense. Predict. Grow. Monitor crops, manage livestock, track finances with AI.',
          },
        },
        {
          path: '/login',
          tags: {
            title: 'Login - FarmVexa',
            description: 'Sign in to your FarmVexa account.',
          },
        },
        {
          path: '/register',
          tags: {
            title: 'Register - FarmVexa',
            description: 'Create your FarmVexa account.',
          },
        },
      ],
      render: () => '',
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