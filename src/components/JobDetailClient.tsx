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
  const canApply = Boolean(job.apply_url);

  const requirements = useMemo(
    () => normalizeMultilineValues(job.requirements),
    [job.requirements],
  );

  const responsibilities = useMemo(
    () => normalizeMultilineValues(job.responsibilities),
    [job.responsibilities],
  );

  const benefits = useMemo(() => normalizeMultilineValues(job.benefits), [job.benefits]);

  const handleApply = () => {
    if (!job.apply_url) {
      return;
    }

    setAppliedCount((count) => count + 1);
    void incrementJobAppliedCount(job.id);
    window.open(job.apply_url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="ui-card p-5 sm:p-6 lg:p-7">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="size-14 rounded-2xl border border-border bg-background p-1.5">
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
            <h1 className="text-3xl font-semibold tracking-tight text-card-foreground">{job.title}</h1>
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
          onClick={handleApply}
          disabled={!canApply}
          aria-label={canApply ? `Apply for ${job.title}` : `Application unavailable for ${job.title}`}
          className="ui-button ui-button-primary"
        >
          {canApply ? `Apply now (${appliedCount})` : "Application unavailable"}
        </button>
      </header>

      <div className="grid gap-3 rounded-2xl border border-border bg-background p-4 sm:grid-cols-3">
        <div>
          <p className="ui-label">Category</p>
          <p className="mt-1 text-sm font-semibold text-card-foreground">
            {job.category?.name || "General"}
          </p>
        </div>
        <div>
          <p className="ui-label">Job Type</p>
          <p className="mt-1 text-sm font-semibold text-card-foreground">{job.job_type || "N/A"}</p>
        </div>
        <div>
          <p className="ui-label">Salary</p>
          <p className="mt-1 text-sm font-semibold text-card-foreground">{formatSalary(job)}</p>
        </div>
      </div>

      {job.description ? (
        <section className="mt-8">
          <h2 className="ui-section-title">Job Description</h2>
          <p className="ui-reading mt-3 max-w-none whitespace-pre-line">
            {job.description}
          </p>
        </section>
      ) : null}

      {requirements.length ? (
        <section className="mt-8">
          <h2 className="ui-section-title">Requirements</h2>
          <ul className="ui-zebra mt-3 space-y-2">
            {requirements.map((item) => (
              <li key={item} className="ui-list-item text-sm leading-6 text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {responsibilities.length ? (
        <section className="mt-8">
          <h2 className="ui-section-title">Responsibilities</h2>
          <ul className="ui-zebra mt-3 space-y-2">
            {responsibilities.map((item) => (
              <li key={item} className="ui-list-item text-sm leading-6 text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {benefits.length ? (
        <section className="mt-8">
          <h2 className="ui-section-title">Benefits</h2>
          <ul className="ui-zebra mt-3 space-y-2">
            {benefits.map((item) => (
              <li key={item} className="ui-list-item text-sm leading-6 text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
