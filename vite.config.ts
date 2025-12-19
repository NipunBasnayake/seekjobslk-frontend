import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import sitemapPlugin from "vite-plugin-sitemap";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),

    sitemapPlugin({
      hostname: "https://seekjobslk.com",
      dynamicRoutes: [
        "/",
        "/about",
        "/contact",
        "/privacy-policy",
        "/terms",
      ],
    }),

    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
