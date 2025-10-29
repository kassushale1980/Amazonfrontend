// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // keep this for GitHub Pages or Netlify
  resolve: {
    alias: {
      "@": "/src", // ✅ Allows absolute imports from src
    },
  },
});