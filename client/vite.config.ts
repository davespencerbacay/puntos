import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      constants: path.resolve(import.meta.dirname, './src/constants'),
      assets: path.resolve(import.meta.dirname, './src/assets'),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
})
