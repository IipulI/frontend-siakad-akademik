import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic', // ini dia
  }), tailwindcss()],
  test: {
    setupFiles:'/src/setupTests.js',
    globals: true,
    environment: 'jsdom',
  },
});
