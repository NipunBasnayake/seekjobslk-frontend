import type { Metadata } from "next";
import AboutPageClient from "@/components/pages/AboutPageClient";

const siteUrl = "https://seekjobslk.com";

export const metadata: Metadata = {
  title: "About Us | SeekJobsLk",
  description:
    "Learn more about SeekJobsLk, a Sri Lanka focused job portal helping job seekers connect with real opportunities.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/about`,
    title: "About Us | SeekJobsLk",
    description:
      "Learn more about SeekJobsLk, a Sri Lanka focused job portal helping job seekers connect with real opportunities.",
    images: ["/og-default.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | SeekJobsLk",
    description:
      "Learn more about SeekJobsLk, a Sri Lanka focused job portal helping job seekers connect with real opportunities.",
    images: ["/og-default.jpg"],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
