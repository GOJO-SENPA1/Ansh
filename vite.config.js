import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project-site Pages serves at https://<user>.github.io/Ansh/, so the
// production build needs base '/Ansh/'. Dev stays at '/'.
// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Ansh/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
}))
