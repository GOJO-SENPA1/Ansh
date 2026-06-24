import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Netlify serves at the domain root, so base is '/'.
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
