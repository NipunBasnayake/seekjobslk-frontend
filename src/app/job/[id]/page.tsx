import { Suspense } from "react";

interface RelatedJobsProps {
  relatedJobs: any[];
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
                    {getCompanyName(relatedJob)} • {relatedJob.location || "Sri Lanka"}
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
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { JobDetailClient } from "@/components/JobDetailClient";
import { Navbar } from "@/components/Navbar";
import { OptimizedImage } from "@/components/OptimizedImage";
import { parseApplyTarget } from "@/lib/applyTarget";
import { buildJobDescription, formatPostedDate, getCompanyName } from "@/lib/jobPresentation";
import { toIsoString } from "@/lib/jobUtils";
import { sanitizeSocialImageUrl, toAbsoluteUrl } from "@/lib/seo";
import {
  getJobByIdServer,
  getRelatedJobsServer,
} from "@/services/firestore.server";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Dynamic params allows Next.js to render job pages not generated at build time
// This ensures newly added jobs are immediately available without a rebuild
// Combined with revalidation, this provides a balance of performance and freshness
export const dynamicParams = true;
export const revalidate = 60; // Revalidate every 60 seconds for fresh data

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const canonical = toAbsoluteUrl(`/job/${id}`);
  const fallbackImage = toAbsoluteUrl("/opengraph-image");
  const job = await getJobByIdServer(id);

  if (!job) {
    return {
      title: "Job not found | SeekJobsLk",
      description: "This job listing could not be found.",
      alternates: { canonical },
      robots: { index: false, follow: false },
      openGraph: { images: [fallbackImage] },
      twitter: { images: [fallbackImage] },
    };
  }

  const companyName = getCompanyName(job);
  const metaTitle = `${job.title} at ${companyName}`;
  const description = buildJobDescription(job);
  const ogImage = `${toAbsoluteUrl(`/job/${id}/opengraph-image?v=${job.updated_at ?? "1"}`)}`;

  return {
    title: metaTitle,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: metaTitle,
      description,
      images: [ogImage],
      siteName: "SeekJobsLk",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      images: [ogImage],
    },
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getJobByIdServer(id);

  if (!job) {
    notFound();
  }

  // Fetch related jobs (same category, latest 3)
  let relatedJobs = await getRelatedJobsServer(job, {
    days: 45,
    limit: 12, // fetch more to allow filtering
  });

  // Filter to same category (not company) and sort by posted_date descending, then take 3
  function toMillis(date: any): number {
    if (!date) return 0;
    if (typeof date === "number") return date;
    if (date instanceof Date) return date.getTime();
    if (typeof date === "string") {
      const d = new Date(date);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    }
    // Firestore Timestamp
    if (typeof date === "object" && date !== null) {
      if (typeof date.toDate === "function") return date.toDate().getTime();
      if (typeof date.seconds === "number") return date.seconds * 1000;
    }
    return 0;
  }

  const jobCategoryId = job?.category?.id;
  if (jobCategoryId) {
    relatedJobs = relatedJobs
      .filter(j => j.category?.id === jobCategoryId && j.id !== job.id)
      .sort((a, b) => {
        const aDate = toMillis(a.posted_date);
        const bDate = toMillis(b.posted_date);
        return bDate - aDate;
      })
      .slice(0, 3);
  } else {
    // fallback: just latest 3 jobs, excluding current
    relatedJobs = relatedJobs
      .filter(j => j.id !== job.id)
      .sort((a, b) => {
        const aDate = toMillis(a.posted_date);
        const bDate = toMillis(b.posted_date);
        return bDate - aDate;
      })
      .slice(0, 3);
  }

  const jobUrl = toAbsoluteUrl(`/job/${job.id}`);
  const companyName = getCompanyName(job);
  const shareImage = sanitizeSocialImageUrl(job.company?.logo_url) ?? toAbsoluteUrl("/og-default.png");
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
    jobLocationType: job.work_mode?.toLowerCase().includes("remote") ? "TELECOMMUTE" : undefined,
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
      </main>

      <Footer />
    </>
  );
}
