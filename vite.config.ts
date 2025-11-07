import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      // HTTP API 代理（SDK 使用 /aqueti-api 作为 baseURL）
      '/aqueti-api': {
        target: 'http://10.10.18.242:8081',
        ws: false,
        changeOrigin: true,
        secure: false,
      },
      // 兼容 /api 路径（SDK 内部某些请求可能直接使用 /api）
      '/api': {
        target: 'http://10.10.18.242:8081/aqueti-api',
        ws: false,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

