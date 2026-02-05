import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobDetailClient } from "@/components/JobDetailClient";
import { getJobDate, toIsoString } from "@/lib/jobUtils";
import { normalizeMultilineValues } from "@/lib/normalize";
import { getSiteUrl } from "@/lib/site";
import {
  getJobByIdServer,
  getRelatedJobsServer,
} from "@/services/firestore.server";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

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
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostingSchema),
        }}
      />

      <Link
        href="/"
        className="inline-flex rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
      >
        Back to jobs
      </Link>

      <JobDetailClient job={job} />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="mb-4 text-xl font-semibold text-card-foreground">Related Jobs</h2>

        {relatedJobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No related jobs available right now.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
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
                  className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/40"
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
