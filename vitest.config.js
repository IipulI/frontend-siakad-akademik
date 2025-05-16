// vite.config.js atau vitest.config.js
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  test: {
    setupFiles:'/src/setupTests.js',
    globals: true,
    environment: 'jsdom',
    root: fileURLToPath(new URL('./', import.meta.url)), // Opsional: membantu resolve path
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Contoh alias untuk memudahkan import
    },
  },
});