import type { Metadata } from "next";
import HomePageClient from "@/components/pages/HomePageClient";
import { Suspense } from "react";
import { getJobsServer } from "@/lib/firestore.server";
import { getJobTimestamp } from "@/lib/jobUtils";
import type { Job } from "@/types";

const siteUrl = "https://seekjobslk.com";

export const revalidate = 300;

type SearchParams = { [key: string]: string | string[] | undefined };

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}): Promise<Metadata> {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const pageParam = Array.isArray(resolvedParams?.page)
    ? resolvedParams?.page[0]
    : resolvedParams?.page;
  const pageNumber = pageParam ? Number(pageParam) : 1;
  const canonical =
    pageNumber && pageNumber > 1 ? `${siteUrl}?page=${pageNumber}` : siteUrl;

  const hasOtherParams = Boolean(
    resolvedParams &&
      Object.keys(resolvedParams).some((key) => key && key !== "page")
  );

  return {
    title: "SeekJobsLk - Find Your Dream Job in Sri Lanka",
    description:
      "Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies.",
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: "SeekJobsLk - Find Your Dream Job in Sri Lanka",
      description:
        "Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies.",
      images: ["/og-default.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: "SeekJobsLk - Find Your Dream Job in Sri Lanka",
      description:
        "Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies.",
      images: ["/og-default.jpg"],
    },
    robots: hasOtherParams ? { index: false, follow: true } : undefined,
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  let jobs: Job[] | null = null;

  try {
    jobs = await getJobsServer();
    jobs = [...jobs].sort(
      (a, b) => getJobTimestamp(b.posted_date) - getJobTimestamp(a.posted_date)
    );
  } catch {
    jobs = null;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomePageClient initialJobs={jobs} />
    </Suspense>
  );
}
