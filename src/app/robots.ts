import type { MetadataRoute } from "next";
import { toAbsoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const homeUrl = toAbsoluteUrl("/");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: toAbsoluteUrl("/sitemap.xml"),
    host: new URL(homeUrl).origin,
  };
}
