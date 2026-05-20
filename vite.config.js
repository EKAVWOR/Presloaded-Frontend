import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@utils": path.resolve(__dirname, "utils"),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // ✅ FIXED: manualChunks must be a FUNCTION in Vite 8 (Rolldown)
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react/")) {
              return "vendor-react";
            }
            if (id.includes("react-router-dom")) {
              return "vendor-router";
            }
            if (id.includes("react-icons")) {
              return "vendor-icons";
            }
            if (id.includes("react-paystack")) {
              return "vendor-payment";
            }
            if (id.includes("react-player") || id.includes("@mux")) {
              return "vendor-player";
            }
            if (id.includes("react-hot-toast")) {
              return "vendor-toast";
            }
            if (id.includes("html2canvas")) {
              return "vendor-html2canvas";
            }
            if (id.includes("jspdf")) {
              return "vendor-pdf";
            }
            // All other node_modules go into vendor chunk
            return "vendor";
          }
        },
      },
    },
  },
});