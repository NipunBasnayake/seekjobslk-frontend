"use client";

import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { useCallback, useMemo, useState, type MouseEvent } from "react";
import { getJobDate } from "@/lib/jobUtils";
import { incrementJobAppliedCount } from "@/services/firebaseData";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

function formatSalary(job: Job): string {
  if (job.salary_text?.trim()) return job.salary_text;

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

export function JobCard({ job }: JobCardProps) {
  const [appliedCount, setAppliedCount] = useState(job.applied_count ?? 0);
  const canApply = Boolean(job.apply_url);

  const postedDate = useMemo(() => {
    const date = getJobDate(job.posted_date ?? null);
    if (!date) return "Recently posted";

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

      if (!job.apply_url) return;

      setAppliedCount((count) => count + 1);
      void incrementJobAppliedCount(job.id);

      window.open(job.apply_url, "_blank", "noopener,noreferrer");
    },
    [job.apply_url, job.id],
  );

  return (
    <Link
      href={`/job/${job.id}`}
      className="group relative block rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Subtle hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 transition group-hover:opacity-100" />

      {/* Header */}
      <div className="relative mb-5 flex items-start gap-4">
        <div className="flex size-14 items-center justify-center rounded-xl border bg-muted/40">
          <img
            src={job.company?.logo_url}
            alt={`${job.company?.name || "Company"} logo`}
            width={40}
            height={40}
            className="rounded-lg object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-card-foreground transition group-hover:text-primary">
            {job.title}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {job.company?.name || "Unknown Company"}
          </p>
        </div>

        <ArrowUpRight className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
      </div>

      {/* Tags */}
      <div className="mb-5 flex flex-wrap gap-2">
        {job.job_type && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {job.job_type}
          </span>
        )}
        {job.location && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {job.location}
          </span>
        )}
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
          {postedDate}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          <span className="font-medium text-card-foreground">
            {appliedCount}
          </span>
          <span>applied</span>
        </div>

        <button
          type="button"
          onClick={handleApply}
          disabled={!canApply}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.03] hover:shadow-md disabled:opacity-50"
        >
          {canApply ? "Apply Now" : "Unavailable"}
        </button>
      </div>
    </Link>
  );
}