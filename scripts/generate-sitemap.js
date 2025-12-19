import fs from "fs";
import path from "path";

const BASE_URL = "https://seekjobslk.com";

const routes = [
  "/",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
];

const distPath = path.resolve("dist");
const sitemapPath = path.join(distPath, "sitemap.xml");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`
  )
  .join("")}
</urlset>`;

if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

fs.writeFileSync(sitemapPath, sitemap);
console.log("✅ sitemap.xml generated");
