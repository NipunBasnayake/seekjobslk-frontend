import type { Metadata } from "next";
import TermsPageClient from "@/components/pages/TermsPageClient";

const siteUrl = "https://seekjobslk.com";

export const metadata: Metadata = {
  title: "Terms & Conditions | SeekJobsLk",
  description:
    "Terms and Conditions governing the use of the SeekJobsLk job portal.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/terms`,
    title: "Terms & Conditions | SeekJobsLk",
    description:
      "Terms and Conditions governing the use of the SeekJobsLk job portal.",
    images: ["/og-default.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | SeekJobsLk",
    description:
      "Terms and Conditions governing the use of the SeekJobsLk job portal.",
    images: ["/og-default.jpg"],
  },
};

export default function TermsPage() {
  return <TermsPageClient />;
}
