import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import Terms from "./Terms";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions | SeekJobsLk",
  description:
    "Review SeekJobsLk terms covering job listings, applications, user responsibilities, and external links.",
  path: "/terms",
});

export default function TermsPage() {
  return <Terms />;
}
