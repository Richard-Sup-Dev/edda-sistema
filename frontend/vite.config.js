import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 2. Aqui definimos que o '@' aponta para a pasta 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
  }
})