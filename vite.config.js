import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    hmr: { overlay: false },
    headers: {
      "Content-Security-Policy":
        "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; frame-src *; connect-src *; img-src * data: blob:; style-src * 'unsafe-inline';",
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/sanctum": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
