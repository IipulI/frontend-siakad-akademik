<<<<<<< HEAD
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
=======
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', 'src/__tests__/**/*.{js,jsx,ts,tsx}']
  }
})
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
