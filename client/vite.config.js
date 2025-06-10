import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output to dist folder within client directory
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // Bind to all interfaces
    strictPort: true, // Exit if port is already in use
    open: true, // Automatically open browser
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    // Force use of real backend
    'import.meta.env.VITE_USE_MOCK_API': '"false"',
    'import.meta.env.VITE_API_URL': '"http://localhost:5000/api"',
  },
}) 