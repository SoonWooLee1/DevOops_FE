import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // 기본 포트
    // Vue에서 /api로 호출하면 스프링(8080)으로 프록시
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 프론트의 /api/* → 백엔드의 /* 로 전달
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // @ → src
    },
  },
})
