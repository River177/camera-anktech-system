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
      '/aqueti-api': {
        target: 'http://10.10.18.242:8081',
        // target: 'http://127.0.0.1:8888',
        ws: false,
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/path/, ''),
      },
      // WebSocket 代理（如果需要）
      // '/message': {
      //   target: 'ws://192.168.12.88:8084',
      //   ws: true,
      //   changeOrigin: true,
      //   secure: false,
      // }
    },
  },
});

