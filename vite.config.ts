import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    host: '0.0.0.0', // ✅ 關鍵設定
    port: 5173,        // 🔁 可以自訂 port
    watch: {
      usePolling: true,   // 開啟輪詢
      interval: 100,      // 每 100ms 檢查一次
    },
    proxy: {
      // 將所有 /api 開頭的請求代理到 FastAPI
      '/api': {
        target: 'http://127.0.0.1:12345',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
})
