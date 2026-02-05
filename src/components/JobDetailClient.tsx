"use client";

import { useMemo, useState } from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getJobDate } from "@/lib/jobUtils";
import { normalizeMultilineValues } from "@/lib/normalize";
import { incrementJobAppliedCount } from "@/services/firebaseData";
import type { Job } from "@/types";

interface JobDetailClientProps {
  job: Job;
}

function formatDate(value: Job["posted_date"]): string {
  const date = getJobDate(value ?? null);

  if (!date) {
    return "Recently posted";
  }

  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatSalary(job: Job): string {
  if (job.salary_text?.trim()) {
    return job.salary_text;
  }

  const min = job.salary_min;
  const max = job.salary_max;

  if (typeof min === "number" && typeof max === "number") {
    const currency = job.salary_currency || "LKR";
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  }

  if (typeof min === "number") {
    const currency = job.salary_currency || "LKR";
    return `${currency} ${min.toLocaleString()}+`;
  }

  return "Salary negotiable";
}

export function JobDetailClient({ job }: JobDetailClientProps) {
  const [appliedCount, setAppliedCount] = useState(job.applied_count ?? 0);

  const requirements = useMemo(
    () => normalizeMultilineValues(job.requirements),
    [job.requirements],
  );

  const responsibilities = useMemo(
    () => normalizeMultilineValues(job.responsibilities),
    [job.responsibilities],
  );

  const benefits = useMemo(() => normalizeMultilineValues(job.benefits), [job.benefits]);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="size-14 rounded-xl border border-border bg-background p-1.5">
            <OptimizedImage
              src={job.company?.logo_url}
              fallbackSrc="/globe.svg"
              alt={`${job.company?.name || "Company"} logo`}
              width={52}
              height={52}
              className="rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">{job.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {job.company?.name || "Unknown Company"} - {job.location || "Sri Lanka"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {job.job_type || "Full-time"} - Posted {formatDate(job.posted_date)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setAppliedCount((count) => count + 1);
            void incrementJobAppliedCount(job.id);

            if (job.apply_url) {
              window.open(job.apply_url, "_blank", "noopener,noreferrer");
            }
          }}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Apply now ({appliedCount})
        </button>
      </header>

      <div className="grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Category</p>
          <p className="text-sm font-medium text-card-foreground">
            {job.category?.name || "General"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Job Type</p>
          <p className="text-sm font-medium text-card-foreground">{job.job_type || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Salary</p>
          <p className="text-sm font-medium text-card-foreground">{formatSalary(job)}</p>
        </div>
      </div>

      {job.description ? (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold text-card-foreground">Job Description</h2>
          <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {job.description}
          </p>
        </section>
      ) : null}

      {requirements.length ? (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold text-card-foreground">Requirements</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {requirements.map((item) => (
              <li key={item} className="rounded-lg bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {responsibilities.length ? (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold text-card-foreground">Responsibilities</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {responsibilities.map((item) => (
              <li key={item} className="rounded-lg bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {benefits.length ? (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold text-card-foreground">Benefits</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {benefits.map((item) => (
              <li key={item} className="rounded-lg bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
