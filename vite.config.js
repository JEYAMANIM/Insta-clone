import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    watch: {
      ignored: ['**/db.json'], // Prevents Vite from auto-refreshing when db.json is updated
    },
  },

  build: {
    // Disable source maps in production for smaller output
    sourcemap: false,

    // Raise inline threshold – assets <8 KB get base64-inlined (avoids extra HTTP requests)
    assetsInlineLimit: 8192,

    rollupOptions: {
      output: {
        // Manual chunk splitting keeps vendor code cached across deploys
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
        },
        // Hash-based filenames for long-term caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },

    // Warn on chunks > 500 KB
    chunkSizeWarningLimit: 500,
  },
})