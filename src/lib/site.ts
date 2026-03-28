import { env } from "@/lib/env";

export function getSiteUrl(): string {
  const baseUrl = env.siteUrl;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}
