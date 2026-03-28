import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";
import { buildPageMetadata } from "@/lib/seo";
import {
  getActiveJobsServer,
  getCategoriesServer,
  getCompaniesServer,
} from "@/services/firestore.server";

export const revalidate = 120;

export const metadata: Metadata = buildPageMetadata({
  title: "SeekJobsLk | Sri Lanka Job Portal",
  description:
    "Discover verified jobs in Sri Lanka. Search by category, company, location, and salary on SeekJobsLk.",
  path: "/",
  image: "/og-default.png",
});

export default async function HomePage() {
  const [initialJobs, initialCategories, initialCompanies] = await Promise.all([
    getActiveJobsServer(),
    getCategoriesServer(),
    getCompaniesServer(),
  ]);

  return (
    <HomePageClient
      initialJobs={initialJobs}
      initialCategories={initialCategories}
      initialCompanies={initialCompanies}
    />
  );
}
