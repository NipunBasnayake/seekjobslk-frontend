"use client";

import { useMemo } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { AdSlotPlaceholder } from "@/components/AdSlotPlaceholder";
import { ApplyButton } from "@/components/ApplyButton";
import { JobDescriptionMarkdown } from "@/components/MarkdownContent";
import { OptimizedImage } from "@/components/OptimizedImage";
import { parseApplyTarget } from "@/lib/applyTarget";
import { env } from "@/lib/env";
import {
  formatPostedDate,
  formatSalary,
  getCompanyInitials,
  getCompanyName,
  isFeaturedJob,
  isRemoteJob,
} from "@/lib/jobPresentation";
import { normalizeMultilineValues } from "@/lib/normalize";
import type { Job } from "@/types";
import React from "react";

interface JobDetailClientProps {
  job: Job;
}

const APPLY_VERIFICATION_SECONDS = env.applyVerificationSeconds;

function getWorkModeLabel(job: Job): string {
  if (isRemoteJob(job)) return "Remote";
  return job.work_mode || "On-site";
}

function getEmploymentTypeLabel(job: Job): string {
  return job.job_type || job.employment_type || "Not specified";
}

export function JobDetailClient({ job }: JobDetailClientProps) {
  const companyName = getCompanyName(job);
  const companyInitials = getCompanyInitials(companyName);
  const salaryLabel = formatSalary(job);
  const postedDate = formatPostedDate(job.posted_date ?? null, "en-LK");
  const featured = isFeaturedJob(job);
  const remote = isRemoteJob(job);
  const [appliedCount, setAppliedCount] = React.useState(job.applied_count ?? 0);

  const applyTarget = useMemo(
    () =>
      parseApplyTarget({
        apply_url: job.apply_url,
        apply_email: job.apply_email,
        apply_phone: job.apply_phone,
      }),
    [job.apply_email, job.apply_phone, job.apply_url],
  );

  const requirements = useMemo(
    () => normalizeMultilineValues(job.requirements),
    [job.requirements],
  );

  const responsibilities = useMemo(
    () => normalizeMultilineValues(job.responsibilities),
    [job.responsibilities],
  );

  const benefits = useMemo(() => normalizeMultilineValues(job.benefits), [job.benefits]);

  const skills = useMemo(() => normalizeMultilineValues(job.skills), [job.skills]);

  // Check if description looks like markdown (has headers, lists, bold, etc.)
  const hasMarkdownContent =
    job.description &&
    (job.description.includes("##") ||
      job.description.includes("**") ||
      job.description.includes("- ") ||
      job.description.includes("* "));

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      {/* Main Content */}
      <article className="space-y-6">
        {/* Job Header Card */}
        <header className="ui-card ui-card-tinted overflow-hidden">
          {/* Featured banner */}
          {featured && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-5 py-2.5 sm:px-6">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold text-primary">Featured Position</span>
            </div>
          )}

          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-start gap-4 sm:gap-5">
              {/* Company Logo */}
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border-2 border-border/50 bg-surface shadow-sm sm:size-20">
                <OptimizedImage
                  src={job.company?.logo_url}
                  fallbackSrc="/globe.svg"
                  fallbackContent={
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-bold text-primary sm:text-base">
                      {companyInitials}
                    </div>
                  }
                  alt={`${companyName} logo`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              {/* Title and Company */}
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl lg:text-4xl">
                  {job.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground sm:text-base">
                    <Building2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="font-semibold text-card-foreground">{companyName}</span>
                  </p>
                  <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {remote ? "Remote" : job.location || "Sri Lanka"}
                  </p>
                  {appliedCount > 0 && (
                    <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {appliedCount} {appliedCount === 1 ? "applicant" : "applicants"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="mt-6 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Posted
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground">{postedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Job Type
                  </p>
                  <p className="text-sm font-semibold text-card-foreground">
                    {getEmploymentTypeLabel(job)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Work Mode
                  </p>
                  <p className="text-sm font-semibold text-card-foreground">
                    {getWorkModeLabel(job)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Salary
                  </p>
                  <p className="text-sm font-semibold text-card-foreground">{salaryLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Job Description Card */}
        {job.description && (
          <section className="ui-card p-5 sm:p-6 lg:p-8">
            <h2 className="ui-section-title flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Job Description
            </h2>

            {hasMarkdownContent ? (
              <div className="p-4">
                <JobDescriptionMarkdown content={job.description} />
              </div>
            ) : (
              <div className="ui-reading mt-5 whitespace-pre-line">{job.description}</div>
            )}
          </section>
        )}

        {/* Requirements Section */}
        {requirements.length > 0 && (
          <section className="ui-card p-5 sm:p-6 lg:p-8">
            <h2 className="ui-section-title flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Requirements
            </h2>
            <ul className="mt-5 space-y-3" role="list">
              {requirements.map((item, index) => (
                <li
                  key={`req-${index}`}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Responsibilities Section */}
        {responsibilities.length > 0 && (
          <section className="ui-card p-5 sm:p-6 lg:p-8">
            <h2 className="ui-section-title flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Responsibilities
            </h2>
            <ul className="mt-5 space-y-3" role="list">
              {responsibilities.map((item, index) => (
                <li
                  key={`resp-${index}`}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="ui-card p-5 sm:p-6 lg:p-8">
            <h2 className="ui-section-title flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Required Skills
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`skill-${index}`}
                  className="ui-tag hover:border-primary/40 hover:bg-primary/5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <section className="ui-card p-5 sm:p-6 lg:p-8">
            <h2 className="ui-section-title flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              Benefits
            </h2>
            <ul className="mt-5 space-y-3" role="list">
              {benefits.map((item, index) => (
                <li
                  key={`benefit-${index}`}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* Sidebar */}
      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        {/* Apply Card */}
        <section className="ui-card ui-card-tinted p-5 sm:p-6">
          <h2 className="ui-card-title">Apply for this Role</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Take the next step in your career. We run a quick verification before routing you to the
            employer channel.
          </p>

          <div className="mt-5">
            <ApplyButton
              jobId={job.id}
              jobTitle={job.title}
              applyTarget={applyTarget}
              initialAppliedCount={appliedCount}
              countdownSeconds={APPLY_VERIFICATION_SECONDS}
              onApplied={() => setAppliedCount((c) => c + 1)}
            />
          </div>

          {/* Application stats */}
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-border/50 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Quick apply</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <Users className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>{appliedCount} applied</span>
            </div>
          </div>
        </section>

        {/* Ad Placeholder */}
        <AdSlotPlaceholder label="Sponsored" />

        {/* Company Info Card */}
        <section className="ui-card p-5">
          <h2 className="ui-card-title">About the Employer</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="ui-label">Company</dt>
              <dd className="mt-1 font-medium text-card-foreground">{companyName}</dd>
            </div>

            <div>
              <dt className="ui-label">Industry</dt>
              <dd className="mt-1 text-card-foreground">{job.category?.name || "General"}</dd>
            </div>

            <div>
              <dt className="ui-label">Location</dt>
              <dd className="mt-1 text-card-foreground">{job.location || "Sri Lanka"}</dd>
            </div>

            {job.company?.website && (
              <div>
                <dt className="ui-label">Website</dt>
                <dd className="mt-1">
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                  >
                    Visit website
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </section>
      </aside>
    </section>
  );
}
