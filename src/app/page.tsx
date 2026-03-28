import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";
import { getCompanyName } from "@/lib/jobPresentation";
import { toIsoString } from "@/lib/jobUtils";
import { buildPageMetadata, toAbsoluteUrl } from "@/lib/seo";
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

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest jobs in Sri Lanka",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: initialJobs.length,
    itemListElement: initialJobs.slice(0, 40).map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: toAbsoluteUrl(`/job/${job.id}`),
      name: `${job.title} at ${getCompanyName(job)}`,
      datePosted: toIsoString(job.posted_date ?? null) ?? undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
      <HomePageClient
        initialJobs={initialJobs}
        initialCategories={initialCategories}
        initialCompanies={initialCompanies}
      />
    </>
  );
}
