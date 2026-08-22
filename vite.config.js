import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  darkMode: 'class',
  plugins: [react(),tailwindcss()],
  server: {
    watch: {
      ignored: ['**/db.json'], // Prevents Vite from auto-refreshing when db.json is updated
    },
  },
})
