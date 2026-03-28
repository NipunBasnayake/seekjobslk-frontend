"use client";

import Link from "next/link";
import {
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

  return (
    <Link
      href={`/job/${job.id}`}
      className="ui-card ui-card-hover block p-5 sm:p-6"
      aria-label={`View job: ${job.title} at ${companyName}`}
    >
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border bg-muted/40 sm:size-16">
          <OptimizedImage
            src={job.company?.logo_url}
            fallbackSrc="/globe.svg"
            fallbackContent={
              <div className="grid h-full w-full place-items-center bg-primary/10 text-xs font-semibold text-primary sm:text-sm">
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
          <h2 className="line-clamp-2 text-base font-semibold leading-tight text-card-foreground sm:text-lg">
            {job.title}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate font-medium">{companyName}</span>
            </span>

            {featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <Sparkles className="size-3" aria-hidden="true" />
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tags and metadata */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {job.job_type && (
          <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-card-foreground">
            <Briefcase className="mr-1.5 inline-block size-3.5" aria-hidden="true" />
            {job.job_type}
          </span>
        )}

        <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-card-foreground">
          <MapPin className="mr-1.5 inline-block size-3.5" aria-hidden="true" />
          {remote ? "Remote" : job.location || "Sri Lanka"}
        </span>

        <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-card-foreground">
          <Wallet className="mr-1.5 inline-block size-3.5" aria-hidden="true" />
          {salaryLabel}
        </span>

        <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <CalendarDays className="mr-1.5 inline-block size-3.5" aria-hidden="true" />
          {postedDate}
        </span>
      </div>

      {/* Footer: Applications count */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-card-foreground">{appliedCount}</strong>{" "}
            {appliedCount === 1 ? "application" : "applications"}
          </span>
        </div>
      </div>
    </Link>
  );
}
