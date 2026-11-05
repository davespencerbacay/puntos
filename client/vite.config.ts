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
      models: path.resolve(import.meta.dirname, './src/models'),
      pages: path.resolve(import.meta.dirname, './src/pages'),
      services: path.resolve(import.meta.dirname, './src/services'),
      layouts: path.resolve(import.meta.dirname, './src/layouts'),
      components: path.resolve(import.meta.dirname, './src/components'),
      utilities: path.resolve(import.meta.dirname, './src/utilities'),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
})
