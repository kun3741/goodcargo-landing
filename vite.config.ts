import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Зберігаємо оригінальні імена файлів для картинок
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name ? assetInfo.name.split('.').at(1) : '';
          // Для зображень зберігаємо оригінальну структуру без хешу
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType || '')) {
            return `assets/[name].[ext]`;
          }
          // Для інших файлів (CSS, шрифти тощо) використовуємо хеш
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
  },
}));
