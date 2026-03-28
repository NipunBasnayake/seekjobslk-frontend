"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Users,
  MapPin,
  Briefcase,
  CalendarDays,
  Sparkles,
  Wallet,
  Building2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getJobDate } from "@/lib/jobUtils";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const [appliedCount] = useState(job.applied_count ?? 0);
  const [logoError, setLogoError] = useState(false);

  const postedDate = useMemo(() => {
    const date = getJobDate(job.posted_date ?? null);
    if (!date) return "Recently posted";

    return new Intl.DateTimeFormat("en-LK", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }, [job.posted_date]);

  const companyName = job.company?.name || "Unknown Company";
  const initials = useMemo(() => {
    const parts = companyName.split(" ").filter(Boolean);
    const a = parts[0]?.[0] ?? "C";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [companyName]);

  // Optional fields
  const salary = (job as any)?.salary_range || (job as any)?.salary;
  const isRemote = (job as any)?.is_remote || (job as any)?.remote;

  return (
    <Link
      href={`/job/${job.id}`}
      className={[
        "group relative block overflow-hidden rounded-2xl border bg-card p-5 sm:p-6",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-2xl hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
      ].join(" ")}
      aria-label={`View job: ${job.title} at ${companyName}`}
    >
      {/* Glow layer */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute -inset-28 bg-linear-to-r from-primary/12 via-transparent to-primary/12 blur-3xl" />
      </div>

      {/* Subtle top sheen */}
      <div className="pointer-events-none absolute -top-24 left-0 right-0 h-40 bg-linear-to-b from-white/10 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        {/* Logo */}
        <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border bg-muted/30">
          {!logoError && job.company?.logo_url ? (
            <>
              <img
                src={job.company.logo_url}
                alt={`${companyName} logo`}
                className="h-full w-full object-cover transition duration-300"
                loading="lazy"
                onError={() => setLogoError(true)}
              />

              {/* subtle overlay + ring glow on hover */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/0 via-white/0 to-black/10 opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />
            </>
          ) : (
            <div className="grid h-full w-full place-items-center bg-primary/10 text-xs font-bold text-primary">
              {initials}
            </div>
          )}
        </div>

        {/* Title + company */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-card-foreground transition group-hover:text-primary sm:text-lg">
              {job.title}
            </h3>

            <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="size-3.5" />
            <p className="truncate font-medium uppercase tracking-[0.04em]">
              {companyName}
            </p>

            {(job as any)?.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <Sparkles className="size-3.5" />
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Meta chips */}
      <div className="relative mt-4 flex flex-wrap gap-2">
        {job.job_type && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs font-medium text-card-foreground">
            <Briefcase className="size-3.5 text-muted-foreground" />
            {job.job_type}
          </span>
        )}

        {isRemote && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs font-medium text-card-foreground">
            <MapPin className="size-3.5 text-muted-foreground" />
            Remote
          </span>
        )}

        {!isRemote && job.location && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs font-medium text-card-foreground">
            <MapPin className="size-3.5 text-muted-foreground" />
            {job.location}
          </span>
        )}

        {salary && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs font-medium text-card-foreground">
            <Wallet className="size-3.5 text-muted-foreground" />
            {salary}
          </span>
        )}

        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs font-medium text-card-foreground">
          <CalendarDays className="size-3.5 text-muted-foreground" />
          {postedDate}
        </span>

        <div className="ml-auto inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          <span className="font-semibold text-card-foreground">
            {appliedCount}
          </span>
          <span>applied</span>
        </div>
      </div>
    </Link>
  );
}