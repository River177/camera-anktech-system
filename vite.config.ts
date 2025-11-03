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
      // HTTP API 代理
      '/aqueti-api': {
        target: 'http://10.10.18.242:8081',
        ws: false,
        changeOrigin: true,
        secure: false,
      },
      // WebSocket 代理 - 重要！
      '/ws': {
        target: 'ws://10.10.18.242:7777',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

