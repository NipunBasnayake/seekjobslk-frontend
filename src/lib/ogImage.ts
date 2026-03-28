import { BRAND_LOGO_PATH } from "@/lib/brand";
import { toAbsoluteUrl } from "@/lib/seo";

function getFallbackLogoUrl(): string {
  return toAbsoluteUrl(BRAND_LOGO_PATH);
}

export function resolveOgCompanyLogoUrl(value?: string | null): string {
  const candidate = value?.trim();

  if (!candidate) {
    return getFallbackLogoUrl();
  }

  try {
    const url = new URL(candidate);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {}

  return getFallbackLogoUrl();
}
