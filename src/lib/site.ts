import { env } from "@/lib/env";

export const SITE_NAME = "SeekJobsLk";
export const SITE_DOMAIN = "seekjobslk.com";
export const PRODUCTION_SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_DEFAULT_DESCRIPTION =
  "Discover verified jobs in Sri Lanka. Search by category, company, location, and salary on SeekJobsLk.";

function normalizeSiteUrl(value?: string): string | null {
  const candidate = value?.trim();
  if (!candidate) {
    return null;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    return parsed.origin;
  } catch {
    return null;
  }
}

function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local")
  );
}

export function getSiteUrl(): string {
  const normalizedEnvUrl = normalizeSiteUrl(env.siteUrl);

  if (!normalizedEnvUrl) {
    return process.env.NODE_ENV === "production"
      ? PRODUCTION_SITE_URL
      : "http://localhost:3000";
  }

  const host = new URL(normalizedEnvUrl).hostname.toLowerCase();
  if (process.env.NODE_ENV === "production" && isLocalHost(host)) {
    return PRODUCTION_SITE_URL;
  }

  return normalizedEnvUrl;
}
