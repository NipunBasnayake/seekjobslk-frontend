import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import About from "./About";

export const metadata: Metadata = buildPageMetadata({
  title: "About SeekJobsLk | Sri Lanka Job Portal",
  description:
    "Learn about SeekJobsLk, a Sri Lanka-focused job portal providing verified listings and direct employer application paths.",
  path: "/about",
});

export default function AboutPage() {
  return <About />;
}
