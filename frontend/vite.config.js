// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // ✅ This automatically opens your browser
  },
  resolve: {
    extensions: [".js", ".jsx"], // ✅ Makes sure JSX files work
  },
});
