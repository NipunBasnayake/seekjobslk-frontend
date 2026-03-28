import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import PrivacyPolicy from "./PrivacyPolicy";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | SeekJobsLk",
  description:
    "Read how SeekJobsLk handles personal information, cookies, advertising, and third-party services including Google.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
