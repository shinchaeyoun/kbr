import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': '/src', // 예: @를 src 폴더로 매핑
    },
  },
  server: {
    host: true,
    port: 7000,
    // 또는 다른 포트로 변경하고 싶다면:
    // port: 3000,
    // port: 8080,
  // },
  // define: {
  //   // Vite에서 환경 변수를 전역으로 정의
  //   'process.env': process.env
  }
});