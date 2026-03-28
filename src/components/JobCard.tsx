"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Briefcase,
  MapPin,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import {
  formatPostedDate,
  formatSalary,
  getCompanyInitials,
  getCompanyName,
  isFeaturedJob,
  isRemoteJob,
} from "@/lib/jobPresentation";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const companyName = getCompanyName(job);
  const initials = getCompanyInitials(companyName);
  const salaryLabel = formatSalary(job);
  const postedDate = formatPostedDate(job.posted_date ?? null);
  const remote = isRemoteJob(job);
  const featured = isFeaturedJob(job);

  return (
    <Link
      href={`/job/${job.id}`}
      className={[
        "group relative block overflow-hidden rounded-2xl border bg-card p-5 shadow-card sm:p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
      ].join(" ")}
      aria-label={`View job: ${job.title} at ${companyName}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute -inset-24 bg-linear-to-r from-primary/12 via-transparent to-primary/12 blur-3xl" />
      </div>

      <div className="relative flex items-start gap-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border bg-muted/40">
          <OptimizedImage
            src={job.company?.logo_url}
            fallbackSrc="/globe.svg"
            fallbackContent={
              <div className="grid h-full w-full place-items-center bg-primary/10 text-xs font-bold text-primary">
                {initials}
              </div>
            }
            alt={`${companyName} logo`}
            width={56}
            height={56}
            className="h-full w-full"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-base font-semibold leading-snug text-card-foreground transition group-hover:text-primary sm:text-lg">
              {job.title}
            </h2>
            <ArrowUpRight
              className="mt-1 size-5 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden="true"
            />
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-3.5" aria-hidden="true" />
              <span className="truncate font-medium uppercase tracking-[0.04em]">{companyName}</span>
            </span>
            {featured ? (
              <span className="inline-flex items-center gap-1 rounded-full border bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Featured
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {job.job_type ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs font-medium text-card-foreground">
            <Briefcase className="size-3.5 text-muted-foreground" aria-hidden="true" />
            {job.job_type}
          </span>
        ) : null}

        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs font-medium text-card-foreground">
          <MapPin className="size-3.5 text-muted-foreground" aria-hidden="true" />
          {remote ? "Remote" : job.location || "Sri Lanka"}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs font-medium text-card-foreground">
          <Wallet className="size-3.5 text-muted-foreground" aria-hidden="true" />
          {salaryLabel}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs font-medium text-card-foreground">
          <CalendarDays className="size-3.5 text-muted-foreground" aria-hidden="true" />
          {postedDate}
        </span>

        <div className="ml-auto inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" aria-hidden="true" />
          <span className="font-semibold text-card-foreground">{job.applied_count ?? 0}</span>
          <span>applied</span>
        </div>
      </div>
    </Link>
  );
}
