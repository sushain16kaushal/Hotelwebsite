import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
     tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        // Bade libraries ko alag chunks mein split karo
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'motion': ['framer-motion'],
          'stripe': ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          'charts': ['recharts'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'ui': ['swiper', 'react-datepicker', 'react-hot-toast', 'lucide-react', 'react-icons'],
        }
      }
    },
    // Bundle size warnings threshold
    chunkSizeWarningLimit: 1000,
  }
})

