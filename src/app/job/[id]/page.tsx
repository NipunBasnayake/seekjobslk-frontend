import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { JobDetailClient } from "@/components/JobDetailClient";
import { Navbar } from "@/components/Navbar";
import { OptimizedImage } from "@/components/OptimizedImage";
import { parseApplyTarget } from "@/lib/applyTarget";
import { BRAND_LOGO_PATH } from "@/lib/brand";
import { buildJobDescription, formatPostedDate, getCompanyName } from "@/lib/jobPresentation";
import { getJobTimestamp, toIsoString } from "@/lib/jobUtils";
import { buildJobMetadata, sanitizeSocialImageUrl, toAbsoluteUrl } from "@/lib/seo";
import {
  getJobByIdServer,
  getRelatedJobsServer,
} from "@/services/firestore.server";
import type { Job } from "@/types";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface RelatedJobsProps {
  relatedJobs: Job[];
}

export const dynamicParams = true;
export const revalidate = 60;

function trimMetadataText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function buildJobMetadataDescription(job: Job, companyName: string): string {
  const location = job.location?.trim();
  const employmentType = (job.employment_type ?? job.job_type)?.trim();
  const descriptionParts = [companyName, location, employmentType].filter(Boolean);
  const summary = descriptionParts.join(" - ");

  if (!summary) {
    return "Verified job opportunity in Sri Lanka on SeekJobsLk.";
  }

  return trimMetadataText(`${summary}. Apply directly on SeekJobsLk.`, 160);
}

function buildJobOgImageUrl(job: Job): string {
  const imageUrl = new URL(toAbsoluteUrl(`/job/${job.id}/opengraph-image`));
  const versionToken =
    toIsoString(job.updated_at ?? null) ??
    toIsoString(job.posted_date ?? null) ??
    "1";

  imageUrl.searchParams.set("v", versionToken);
  return imageUrl.toString();
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const canonicalPath = `/job/${id}`;
  const job = await getJobByIdServer(id);

  if (!job) {
    return buildJobMetadata({
      title: "Job not found",
      description: "This job listing could not be found.",
      path: canonicalPath,
      image: toAbsoluteUrl("/opengraph-image"),
      imageAlt: "SeekJobsLk - Verified jobs in Sri Lanka",
      noIndex: true,
    });
  }

  const companyName = getCompanyName(job);
  const metadataTitle = trimMetadataText(`${job.title} at ${companyName}`, 110);

  return buildJobMetadata({
    title: metadataTitle,
    description: buildJobMetadataDescription(job, companyName),
    path: canonicalPath,
    image: buildJobOgImageUrl(job),
    imageAlt: metadataTitle,
  });
}

function RelatedJobs({ relatedJobs }: RelatedJobsProps) {
  return (
    <section className="ui-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="ui-section-title">Related Jobs</h2>
        <Link href="/#jobs" className="text-sm font-medium text-primary hover:underline">
          View all jobs
        </Link>
      </div>

      {relatedJobs.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          No related jobs available right now.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedJobs.map((relatedJob) => (
            <Link
              key={relatedJob.id}
              href={`/job/${relatedJob.id}`}
              className="ui-list-item group hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                <div className="relative size-15 shrink-0 overflow-hidden rounded-sm border bg-muted/40">
                  <OptimizedImage
                    src={relatedJob.company?.logo_url}
                    fallbackSrc="/globe.svg"
                    alt={`${getCompanyName(relatedJob)} logo`}
                    width={48}
                    height={48}
                    className="h-full w-full"
                  />
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold text-card-foreground group-hover:text-primary">
                    {relatedJob.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {getCompanyName(relatedJob)} - {relatedJob.location || "Sri Lanka"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatPostedDate(relatedJob.posted_date ?? null)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getJobByIdServer(id);

  if (!job) {
    notFound();
  }

  let relatedJobs = await getRelatedJobsServer(job, {
    days: 45,
    limit: 12,
  });

  const jobCategoryId = job.category?.id;
  if (jobCategoryId) {
    relatedJobs = relatedJobs
      .filter((candidate) => candidate.category?.id === jobCategoryId && candidate.id !== job.id)
      .sort(
        (a, b) =>
          getJobTimestamp(b.posted_date ?? null) - getJobTimestamp(a.posted_date ?? null),
      )
      .slice(0, 3);
  } else {
    relatedJobs = relatedJobs
      .filter((candidate) => candidate.id !== job.id)
      .sort(
        (a, b) =>
          getJobTimestamp(b.posted_date ?? null) - getJobTimestamp(a.posted_date ?? null),
      )
      .slice(0, 3);
  }

  const jobUrl = toAbsoluteUrl(`/job/${job.id}`);
  const companyName = getCompanyName(job);
  const shareImage = sanitizeSocialImageUrl(job.company?.logo_url) ?? toAbsoluteUrl(BRAND_LOGO_PATH);
  const workMode = job.work_mode?.toLowerCase();
  const applyTarget = parseApplyTarget({
    apply_url: job.apply_url,
    apply_email: job.apply_email,
    apply_phone: job.apply_phone,
  });

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
    description: job.description || buildJobDescription(job),
    datePosted: toIsoString(job.posted_date ?? null) ?? undefined,
    validThrough: toIsoString(job.deadline ?? null) ?? undefined,
    identifier: {
      "@type": "PropertyValue",
      name: "SeekJobsLk",
      value: job.id,
    },
    employmentType: job.job_type || job.employment_type || undefined,
    directApply: applyTarget.kind === "url",
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
      sameAs: job.company?.website || toAbsoluteUrl("/"),
      logo: shareImage,
    },
    industry: job.category?.name || undefined,
    jobLocationType: workMode?.includes("remote")
      ? "TELECOMMUTE"
      : undefined,
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
    baseSalary: salaryValue,
    url: jobUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: toAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Jobs",
        item: toAbsoluteUrl("/#jobs"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: job.title,
        item: jobUrl,
      },
    ],
  };

  return (
    <>
      <Navbar />

      <main className="ui-shell flex w-full flex-col gap-6 py-6 sm:gap-8 sm:py-8 lg:py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostingSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />

        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#jobs" className="hover:text-foreground">
                Jobs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{job.title}</li>
          </ol>
        </nav>

        <JobDetailClient job={job} />

        <RelatedJobs relatedJobs={relatedJobs} />

        <section className="ui-card ui-card-tinted p-5 sm:p-6">
          <h2 className="ui-section-title">Career Insights for Better Applications</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Before applying, review practical guidance on CV writing, interview preparation, and
            in-demand skills in Sri Lanka.
          </p>
          <div className="mt-4">
            <Link href="/blog" className="ui-button ui-button-secondary text-sm">
              Read Career Insights
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
