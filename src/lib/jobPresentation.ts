import type { Job } from "@/types";
import { getJobDate } from "@/lib/jobUtils";
import { normalizeMultilineValues } from "@/lib/normalize";

export function getCompanyName(job: Job): string {
  return job.company?.name?.trim() || "Unknown Company";
}

export function getCompanyInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) {
    return "UC";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "UC";
}

export function isRemoteJob(job: Job): boolean {
  const workMode = job.work_mode?.trim().toLowerCase();
  return Boolean(workMode && workMode.includes("remote"));
}

export function isFeaturedJob(job: Job): boolean {
  return job.is_featured === true;
}

export function formatPostedDate(value: Job["posted_date"], locale = "en-LK"): string {
  const date = getJobDate(value ?? null);

  if (!date) {
    return "Recently posted";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatSalary(job: Job): string {
  if (job.salary_text?.trim()) {
    return job.salary_text.trim();
  }

  const min = job.salary_min;
  const max = job.salary_max;
  const currency = job.salary_currency || "LKR";

  if (typeof min === "number" && typeof max === "number") {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  }

  if (typeof min === "number") {
    return `${currency} ${min.toLocaleString()}+`;
  }

  return "Salary negotiable";
}

export function buildJobDescription(job: Job): string {
  if (job.description?.trim()) {
    return job.description.trim().slice(0, 180);
  }

  const requirementValues = normalizeMultilineValues(job.requirements);

  if (requirementValues.length > 0) {
    return requirementValues.join(" | ").slice(0, 180);
  }

  return "Explore this opportunity on SeekJobsLk.";
}
