import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { configDefaults } from 'vitest/config';
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom', // ⬅️ Ini penting untuk DOM
    globals: true,         // ⬅️ Biar bisa pakai describe/it tanpa import
    setupFiles: './vitest.setup.ts', // optional kalau kamu butuh setup awal
    exclude: [...configDefaults.exclude, 'e2e/*'], // optional untuk exclude test tertentu
  },
  define: {
    global: "window",
  },
});
