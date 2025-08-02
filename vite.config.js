import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = mode === "production" ? env.VITE_URL : "/";

  return {
    base: baseUrl,
    plugins: [react()],
    // Remove or fix the define section!
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
    // Optional, usually unnecessary:
    // optimizeDeps: {
    //   include: ["immer"],
    // },
  };
});
