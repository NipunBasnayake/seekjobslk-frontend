import type { Metadata } from "next";
import JobDetailsClient from "@/components/pages/JobDetailsClient";
import { getJobByIdServer } from "@/lib/firestore.server";
import { buildJobExcerpt, ensureAbsoluteUrl } from "@/lib/jobUtils";
import { buildJobPostingSchema } from "@/lib/jobPosting";
import type { Job } from "@/types";

const siteUrl = "https://seekjobslk.com";
const fallbackOg = "/og-default.jpg";

export const revalidate = 900;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const job = await getJobByIdServer(params.id);
  const canonical = `${siteUrl}/job/${params.id}`;

  if (!job) {
    return {
      title: "Job Not Found | SeekJobsLk",
      description: "The job you are looking for could not be found.",
      alternates: { canonical },
      robots: { index: false, follow: true },
      openGraph: {
        type: "website",
        url: canonical,
        title: "Job Not Found | SeekJobsLk",
        description: "The job you are looking for could not be found.",
        images: [fallbackOg],
      },
      twitter: {
        card: "summary_large_image",
        title: "Job Not Found | SeekJobsLk",
        description: "The job you are looking for could not be found.",
        images: [fallbackOg],
      },
    };
  }

  const title = `${job.title} at ${job.company?.name ?? "Company"} | SeekJobsLK`;
  const description = buildJobExcerpt(job.description, job.requirements, 180);
  const ogImage = ensureAbsoluteUrl(job.company?.logo_url, siteUrl, fallbackOg);

  return {
    title,
    description,
    alternates: { canonical },
    keywords: [
      job.title,
      job.company?.name || "Company",
      `jobs in ${job.location || "Sri Lanka"}`,
      "Sri Lanka jobs",
      job.job_type,
    ],
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  let job: Job | null = null;

  try {
    job = await getJobByIdServer(params.id);
  } catch {
    job = null;
  }

  const canonical = `${siteUrl}/job/${params.id}`;
  const schema = job ? buildJobPostingSchema(job, canonical) : null;

  return (
    <>
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}

      <JobDetailsClient jobId={params.id} initialJob={job} initialJobs={null} />
    </>
  );
}
