import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export function toAbsoluteUrl(pathOrUrl: string): string {
  const siteUrl = getSiteUrl();
  return new URL(pathOrUrl, `${siteUrl}/`).toString();
}

export function sanitizeSocialImageUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const absolute = new URL(value, `${getSiteUrl()}/`);
    if (absolute.protocol !== "http:" && absolute.protocol !== "https:") {
      return null;
    }

    return absolute.toString();
  } catch {
    return null;
  }
}

interface BuildPageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: BuildPageMetadataInput): Metadata {
  const canonicalUrl = toAbsoluteUrl(path);
  const shareImage = sanitizeSocialImageUrl(image) ?? toAbsoluteUrl("/og-default.png");

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
