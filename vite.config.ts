import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "window",
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true, // Makes global APIs like `describe`, `it`, `expect` available
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: './src/setupTests.js', // Path to your setup file (see next step)
    css: true, // If you have CSS imports in your components
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'], // Output formats for coverage
    },
  }
});
