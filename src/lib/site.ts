export function getSiteUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!baseUrl) {
    return "http://localhost:3000";
  }

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}
