import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = mode === "production" ? env.VITE_URL : "/";

  return {
    base: baseUrl,
    plugins: [react()],
    build: {
      outDir: "build",
      minify: true,
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `
              @import "./src/assets/scss/streamit-design-system/variables.scss";
              @import "./src/assets/scss/bootstrap/variables.scss";
            `,
          },
        },
      },
    },
    resolve: {
      alias: {
        // Root src alias
        "@": path.resolve(__dirname, "./src"),
        
        // Specific folder aliases based on your structure
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@context": path.resolve(__dirname, "./src/context"),
        "@lang": path.resolve(__dirname, "./src/lang"),
        "@layouts": path.resolve(__dirname, "./src/layouts"),
        "@router": path.resolve(__dirname, "./src/router"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@staticData": path.resolve(__dirname, "./src/StaticData"),
        "@store": path.resolve(__dirname, "./src/store"),
        "@utilities": path.resolve(__dirname, "./src/utilities"),
        "@views": path.resolve(__dirname, "./src/views"),
        
        // CSS/SCSS specific aliases
        "@scss": path.resolve(__dirname, "./src/assets/scss"),
        "@images": path.resolve(__dirname, "./src/assets/images"),
      },
      dedupe: ["react", "react-dom", "react-router-dom"],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "react-redux"],
    },
    define: {
      global: "globalThis",
    },
  };
});
