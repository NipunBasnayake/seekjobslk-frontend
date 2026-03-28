"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Briefcase,
  MapPin,
  Sparkles,
  TrendingUp,
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
import { cn } from "@/lib/cn";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
  priority?: boolean;
}

export function JobCard({ job, priority = false }: JobCardProps) {
  const companyName = getCompanyName(job);
  const initials = getCompanyInitials(companyName);
  const salaryLabel = formatSalary(job);
  const postedDate = formatPostedDate(job.posted_date ?? null);
  const remote = isRemoteJob(job);
  const featured = isFeaturedJob(job);
  const appliedCount = job.applied_count ?? 0;
  const isPopular = appliedCount >= 10;

  return (
    <Link
      href={`/job/${job.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border bg-card p-5 sm:p-6",
        "shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)]",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.15)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        featured && "border-primary/30 bg-gradient-to-br from-primary/[0.02] to-transparent"
      )}
      aria-label={`View job: ${job.title} at ${companyName}`}
    >
      {/* Hover gradient effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      >
        <div className="absolute -inset-24 bg-gradient-to-r from-primary/8 via-transparent to-primary/8 blur-3xl" />
      </div>

      {/* Featured badge - top corner */}
      {featured ? (
        <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-gradient-to-br from-primary to-primary-hover" aria-hidden="true" />
      ) : null}

      <div className="relative flex items-start gap-4">
        {/* Company logo */}
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-background shadow-sm sm:size-16">
          <OptimizedImage
            src={job.company?.logo_url}
            fallbackSrc="/globe.svg"
            fallbackContent={
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/10 to-primary/5 text-xs font-bold text-primary sm:text-sm">
                {initials}
              </div>
            }
            alt={`${companyName} logo`}
            width={64}
            height={64}
            className="h-full w-full object-cover"
            priority={priority}
          />
        </div>

        {/* Job title and company */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-base font-semibold leading-tight tracking-tight text-card-foreground transition-colors duration-200 group-hover:text-primary sm:text-lg">
              {job.title}
            </h2>
            <ArrowUpRight
              className="mt-0.5 size-5 shrink-0 text-muted-foreground/60 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden="true"
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate font-medium">{companyName}</span>
            </span>

            {featured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-inset ring-primary/20">
                <Sparkles className="size-3" aria-hidden="true" />
                Featured
              </span>
            ) : null}

            {isPopular && !featured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400">
                <TrendingUp className="size-3" aria-hidden="true" />
                Popular
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Tags and metadata */}
      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        {job.job_type ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-card-foreground">
            <Briefcase className="size-3.5 text-muted-foreground" aria-hidden="true" />
            {job.job_type}
          </span>
        ) : null}

        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-card-foreground">
          <MapPin className="size-3.5 text-muted-foreground" aria-hidden="true" />
          {remote ? "Remote" : job.location || "Sri Lanka"}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-card-foreground">
          <Wallet className="size-3.5 text-muted-foreground" aria-hidden="true" />
          {salaryLabel}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {postedDate}
        </span>
      </div>

      {/* Footer: Applications count */}
      <div className="relative mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-card-foreground">{appliedCount}</strong>{" "}
            {appliedCount === 1 ? "application" : "applications"}
          </span>
        </div>

        <span className="text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          View details
        </span>
      </div>
    </Link>
  );
}
