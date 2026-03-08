import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  // Build to root/public for server deployment
  base: "/",
  build: {
    outDir: "../server/public",
    emptyOutDir: true,
    sourcemap: false,
  },
});

