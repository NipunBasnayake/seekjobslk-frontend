import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobDetailClient } from "@/components/JobDetailClient";
import { getJobDate, toIsoString } from "@/lib/jobUtils";
import { normalizeMultilineValues } from "@/lib/normalize";
import { getSiteUrl } from "@/lib/site";
import {
  getJobByIdServer,
  getJobsServer,
  getRelatedJobsServer,
} from "@/services/firestore.server";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const jobs = await getJobsServer();
  return jobs.map((job) => ({
    id: job.id,
  }));
}

export const dynamicParams = false;

function buildJobDescription(description?: string, requirements?: string[] | string): string {
  if (description?.trim()) {
    return description.trim().slice(0, 180);
  }

  const requirementValues = normalizeMultilineValues(requirements);

  if (requirementValues.length > 0) {
    return requirementValues.join(" | ").slice(0, 180);
  }

  return "Explore this opportunity on SeekJobsLk.";
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/job/${id}`;
  const metadataBase = new URL(siteUrl);
  const fallbackImage = `${siteUrl}/og-default.png`;

  const job = await getJobByIdServer(id);

  if (!job) {
    return {
      metadataBase,
      title: "Job not found | SeekJobsLk",
      description: "This job listing could not be found.",
      alternates: {
        canonical,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const companyName = job.company?.name || "Company";
  const description = buildJobDescription(job.description, job.requirements);
  const imageUrl = job.company?.logo_url || fallbackImage;

  return {
    metadataBase,
    title: `${job.title} | ${companyName} - SeekJobsLk`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: job.title,
      description: `${companyName} - ${job.location || "Sri Lanka"} - ${job.job_type || "Job"}`,
      type: "article",
      url: canonical,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: job.title,
      description: `${companyName} - ${job.location || "Sri Lanka"} - ${job.job_type || "Job"}`,
      images: [imageUrl],
    },
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getJobByIdServer(id);

  if (!job) {
    notFound();
  }

  const relatedJobs = await getRelatedJobsServer(job, {
    days: 45,
    limit: 6,
  });

  const siteUrl = getSiteUrl();
  const jobUrl = `${siteUrl}/job/${job.id}`;

  const salaryValue =
    typeof job.salary_min === "number" || typeof job.salary_max === "number"
      ? {
          "@type": "MonetaryAmount",
          currency: job.salary_currency || "LKR",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salary_min ?? undefined,
            maxValue: job.salary_max ?? undefined,
            unitText: "MONTH",
          },
        }
      : undefined;

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: buildJobDescription(job.description, job.requirements),
    identifier: {
      "@type": "PropertyValue",
      name: "SeekJobsLk",
      value: job.id,
    },
    datePosted: toIsoString(job.posted_date ?? null) ?? undefined,
    validThrough: toIsoString(job.deadline ?? null) ?? undefined,
    employmentType: job.job_type || job.employment_type || undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company?.name || "SeekJobsLk Employer",
      sameAs: job.company?.website || siteUrl,
      logo: job.company?.logo_url || `${siteUrl}/og-default.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "Sri Lanka",
        addressCountry: "LK",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Sri Lanka",
    },
    directApply: Boolean(job.apply_url),
    url: jobUrl,
    baseSalary: salaryValue,
  };

  return (
    <main className="ui-shell flex w-full flex-col gap-6 py-6 sm:gap-8 sm:py-8 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostingSchema),
        }}
      />

      <Link
        href="/"
        className="ui-button ui-button-secondary w-fit"
        aria-label="Back to all jobs"
      >
        Back to jobs
      </Link>

      <JobDetailClient job={job} />

      <section className="ui-card p-5 sm:p-6">
        <h2 className="ui-section-title">Related Jobs</h2>

        {relatedJobs.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            No related jobs available right now.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedJobs.map((relatedJob) => {
              const postedDate = getJobDate(relatedJob.posted_date ?? null);
              const formattedDate = postedDate
                ? new Intl.DateTimeFormat("en-LK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(postedDate)
                : "Recently posted";

              return (
                <Link
                  key={relatedJob.id}
                  href={`/job/${relatedJob.id}`}
                  className="ui-list-item hover:border-primary/40"
                >
                  <p className="line-clamp-2 text-sm font-semibold text-card-foreground">
                    {relatedJob.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {relatedJob.company?.name || "Unknown Company"} - {relatedJob.location || "Sri Lanka"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{formattedDate}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
