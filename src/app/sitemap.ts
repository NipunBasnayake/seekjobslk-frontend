import type { MetadataRoute } from "next";
import { getActiveJobsServer } from "@/lib/firestore.server";
import { getJobDate } from "@/lib/jobUtils";

const siteUrl = "https://seekjobslk.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  let jobs = [];
  try {
    jobs = await getActiveJobsServer();
  } catch {
    jobs = [];
  }

  const jobEntries = jobs.map((job) => ({
    url: `${siteUrl}/job/${job.id}`,
    lastModified: getJobDate(job.posted_date) ?? new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.9,
  }));

  return [...staticEntries, ...jobEntries];
}
