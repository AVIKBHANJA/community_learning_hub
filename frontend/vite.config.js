import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env variables based on mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],

    // Base public path when served in production
    base: "/",

    // Build options
    build: {
      outDir: "dist",
      sourcemap: mode === "development",
      minify: mode === "production",
      // For better deployment performance
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            ui: ["@headlessui/react", "@heroicons/react"],
          },
        },
      },
    },

    // Development server options
    server: {
      port: 5173,
      strictPort: false,
      open: true,
    },
  };
});
