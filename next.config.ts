import type { NextConfig } from "next";

const defaultTrustedImageHosts = [
  "seekjobslk.com",
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
  "lh3.googleusercontent.com",
  "images.unsplash.com",
  "evzkcmoygfmhbspovodr.supabase.co",
];

const envTrustedImageHosts =
  process.env.NEXT_PUBLIC_TRUSTED_IMAGE_HOSTS?.split(",")
    .map((host) => host.trim())
    .filter(Boolean) ?? [];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
let siteHost: string | null = null;

if (siteUrl) {
  try {
    siteHost = new URL(siteUrl).hostname;
  } catch {
    siteHost = null;
  }
}

const trustedImageHosts = Array.from(
  new Set([
    ...defaultTrustedImageHosts,
    ...envTrustedImageHosts,
    ...(siteHost ? [siteHost] : []),
  ]),
);

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      ...trustedImageHosts.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
      {
        protocol: "http" as const,
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
