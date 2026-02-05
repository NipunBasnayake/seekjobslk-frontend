"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useCallback, useMemo, useState, type MouseEvent } from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getJobDate } from "@/lib/jobUtils";
import { incrementJobAppliedCount } from "@/services/firebaseData";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
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

export function JobCard({ job }: JobCardProps) {
  const [appliedCount, setAppliedCount] = useState(job.applied_count ?? 0);

  const postedDate = useMemo(() => {
    const date = getJobDate(job.posted_date ?? null);

    if (!date) {
      return "Recently posted";
    }

    return new Intl.DateTimeFormat("en-LK", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }, [job.posted_date]);

  const handleApply = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      setAppliedCount((count) => count + 1);
      void incrementJobAppliedCount(job.id);

      if (job.apply_url) {
        window.open(job.apply_url, "_blank", "noopener,noreferrer");
      }
    },
    [job.apply_url, job.id],
  );

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40">
      <div className="mb-4 flex items-start gap-3">
        <div className="size-12 rounded-xl border border-border bg-background p-1.5">
          <OptimizedImage
            src={job.company?.logo_url}
            fallbackSrc="/globe.svg"
            alt={`${job.company?.name || "Company"} logo`}
            width={40}
            height={40}
            showSkeleton
            className="rounded-lg"
          />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/job/${job.id}`}
            className="line-clamp-2 text-lg font-semibold text-card-foreground transition hover:text-primary"
          >
            {job.title}
          </Link>
          <p className="truncate text-sm text-muted-foreground">
            {job.company?.name || "Unknown Company"}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        {job.job_type ? (
          <span className="rounded-full bg-muted px-2.5 py-1">{job.job_type}</span>
        ) : null}
        {job.location ? (
          <span className="rounded-full bg-muted px-2.5 py-1">{job.location}</span>
        ) : null}
        <span className="rounded-full bg-muted px-2.5 py-1">{postedDate}</span>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{formatSalary(job)}</p>

      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/job/${job.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-card-foreground transition hover:border-primary/40"
        >
          <span>View details</span>
          <ArrowUpRight className="size-4" />
        </Link>
        <button
          type="button"
          onClick={handleApply}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <CheckCircle2 className="size-4" />
          <span>Apply ({appliedCount})</span>
        </button>
      </div>
    </article>
  );
}
