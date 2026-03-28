import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import Contact from "./Contact";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us | SeekJobsLk",
  description: "Get in touch with SeekJobsLk for support, questions, and platform-related inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return <Contact />;
}
