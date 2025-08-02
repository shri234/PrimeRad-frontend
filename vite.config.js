import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = mode == "production" ? env.VITE_URL : "/";

  return {
    base: baseUrl,
    plugins: [react()],
    define: {
      global: {},
      process: { env: {} },
    },
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
  };
});
