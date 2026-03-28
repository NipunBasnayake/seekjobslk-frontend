import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

const DEFAULT_SHARE_IMAGE_PATH = "/opengraph-image";
const DEFAULT_SHARE_IMAGE_ALT = `${SITE_NAME} - Verified jobs in Sri Lanka`;

function isLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host.endsWith(".local")
  );
}

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

    if (process.env.NODE_ENV === "production" && isLocalHost(absolute.hostname)) {
      return null;
    }

    return absolute.toString();
  } catch {
    return null;
  }
}

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  noIndex?: boolean;
  openGraphType?: "website" | "article";
}

function normalizeMetaText(value: string, maxLength = 180): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function buildMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  noIndex = false,
  openGraphType = "website",
}: BuildMetadataInput): Metadata {
  const canonicalUrl = toAbsoluteUrl(path);
  const shareImage = sanitizeSocialImageUrl(image) ?? toAbsoluteUrl(DEFAULT_SHARE_IMAGE_PATH);
  const normalizedTitle = normalizeMetaText(title, 120);
  const normalizedDescription = normalizeMetaText(description, 170);
  const socialAlt = normalizeMetaText(imageAlt?.trim() || normalizedTitle, 180);

  return {
    title: normalizedTitle,
    description: normalizedDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: openGraphType,
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: normalizedTitle,
      description: normalizedDescription,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: socialAlt || DEFAULT_SHARE_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: normalizedTitle,
      description: normalizedDescription,
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

interface BuildPageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  noIndex = false,
}: BuildPageMetadataInput): Metadata {
  return buildMetadata({
    title,
    description,
    path,
    image,
    imageAlt,
    noIndex,
    openGraphType: "website",
  });
}

interface BuildJobMetadataInput {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt: string;
  noIndex?: boolean;
}

export function buildJobMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  noIndex = false,
}: BuildJobMetadataInput): Metadata {
  return buildMetadata({
    title,
    description,
    path,
    image,
    imageAlt,
    noIndex,
    openGraphType: "article",
  });
}
