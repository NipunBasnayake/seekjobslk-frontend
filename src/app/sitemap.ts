import type { MetadataRoute } from "next";
import { getAllArticles, getArticleLastModified } from "@/lib/articles";
import { getJobDate } from "@/lib/jobUtils";
import { toAbsoluteUrl } from "@/lib/seo";
import { getActiveJobsServer } from "@/services/firestore.server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: toAbsoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: toAbsoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: toAbsoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl("/privacy-policy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: toAbsoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const jobs = await getActiveJobsServer();
  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: toAbsoluteUrl(`/job/${job.id}`),
    lastModified: getJobDate(job.updated_at ?? job.posted_date ?? null) ?? now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: toAbsoluteUrl(`/blog/${article.slug}`),
    lastModified: getArticleLastModified(article),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...jobPages, ...articlePages];
}
