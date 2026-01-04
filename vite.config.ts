import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "brotli" as any,
      ext: ".br",
    }),
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip" as any,
      ext: ".gz",
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: ["firebase"],
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-tabs",
          ],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers"],
          "vendor-utils": ["clsx", "tailwind-merge", "zod"],
          "vendor-other": [
            "next-themes",
            "react-helmet-async",
            "@tanstack/react-query",
            "sonner",
          ],
        },
      },
    },
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
    ],
  },
}));
