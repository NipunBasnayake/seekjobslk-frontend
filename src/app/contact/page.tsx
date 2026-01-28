import type { Metadata } from "next";
import ContactPageClient from "@/components/pages/ContactPageClient";

const siteUrl = "https://seekjobslk.com";

export const metadata: Metadata = {
  title: "Contact Us | SeekJobsLk",
  description: "Contact SeekJobsLk for support, feedback, or reporting job listing issues.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/contact`,
    title: "Contact Us | SeekJobsLk",
    description:
      "Contact SeekJobsLk for support, feedback, or reporting job listing issues.",
    images: ["/og-default.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | SeekJobsLk",
    description:
      "Contact SeekJobsLk for support, feedback, or reporting job listing issues.",
    images: ["/og-default.jpg"],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
