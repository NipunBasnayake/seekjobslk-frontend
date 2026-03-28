import { BRAND_LOGO_ABSOLUTE_URL } from "@/lib/brand";

export function resolveOgCompanyLogoUrl(value?: string | null): string {
  const candidate = value?.trim();

  if (!candidate) {
    return BRAND_LOGO_ABSOLUTE_URL;
  }

  try {
    const url = new URL(candidate);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {}

  return BRAND_LOGO_ABSOLUTE_URL;
}
