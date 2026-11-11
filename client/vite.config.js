import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:4000" } },
  // chunk مربوط به Babel عمداً بزرگ است و فقط هنگام اجرای تمرین React بارگذاری می‌شود
  build: { chunkSizeWarningLimit: 2500 },
});
