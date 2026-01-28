import type { Job } from "@/types";
import { buildJobExcerpt, getJobDate } from "@/lib/jobUtils";

const employmentTypeMap: Record<string, string> = {
  "Full-Time": "FULL_TIME",
  "Part-Time": "PART_TIME",
  Remote: "REMOTE",
  Hybrid: "OTHER",
};

const parseSalaryValue = (salary?: string): number | null => {
  if (!salary) return null;
  if (/negotiable/i.test(salary)) return null;

  const match = salary.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) && value > 0 ? value : null;
};

export const buildJobPostingSchema = (job: Job, canonicalUrl: string) => {
  const description = buildJobExcerpt(job.description, job.requirements, 5000);
  const postedDate = getJobDate(job.posted_date);
  const salaryValue = parseSalaryValue(job.salary);
  const employmentType =
    employmentTypeMap[job.job_type] || job.job_type || "OTHER";

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: postedDate ? postedDate.toISOString() : undefined,
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company?.name || "Unknown Company",
      logo: job.company?.logo_url || undefined,
      sameAs: job.company?.website || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "Sri Lanka",
        addressCountry: "LK",
      },
    },
    identifier: {
      "@type": "PropertyValue",
      name: "SeekJobsLk",
      value: job.id,
    },
    url: canonicalUrl,
  };

  if (salaryValue) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "LKR",
      value: {
        "@type": "QuantitativeValue",
        value: salaryValue,
      },
    };
  }

  if (job.job_type?.toLowerCase().includes("remote")) {
    schema.jobLocationType = "TELECOMMUTE";
  }

  return schema;
};
