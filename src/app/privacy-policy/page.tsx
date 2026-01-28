import type { Metadata } from "next";
import PrivacyPolicyPageClient from "@/components/pages/PrivacyPolicyPageClient";

const siteUrl = "https://seekjobslk.com";

export const metadata: Metadata = {
  title: "Privacy Policy | SeekJobsLk",
  description:
    "Privacy Policy for SeekJobsLk explaining how we use cookies, ads, and third-party services like Google.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/privacy-policy`,
    title: "Privacy Policy | SeekJobsLk",
    description:
      "Privacy Policy for SeekJobsLk explaining how we use cookies, ads, and third-party services like Google.",
    images: ["/og-default.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | SeekJobsLk",
    description:
      "Privacy Policy for SeekJobsLk explaining how we use cookies, ads, and third-party services like Google.",
    images: ["/og-default.jpg"],
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageClient />;
}
