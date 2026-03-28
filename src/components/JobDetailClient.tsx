"use client";

import { useMemo } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
  Wallet,
} from "lucide-react";
import { AdSlotPlaceholder } from "@/components/AdSlotPlaceholder";
import { ApplyButton } from "@/components/ApplyButton";
import { OptimizedImage } from "@/components/OptimizedImage";
import { parseApplyTarget } from "@/lib/applyTarget";
import {
  formatPostedDate,
  formatSalary,
  getCompanyInitials,
  getCompanyName,
  isRemoteJob,
} from "@/lib/jobPresentation";
import { normalizeMultilineValues } from "@/lib/normalize";
import type { Job } from "@/types";

interface JobDetailClientProps {
  job: Job;
}

const APPLY_LOCK_SECONDS = 10;

function getWorkModeLabel(job: Job): string {
  if (isRemoteJob(job)) {
    return "Remote";
  }

  return job.work_mode || "On-site";
}

export function JobDetailClient({ job }: JobDetailClientProps) {
  const companyName = getCompanyName(job);
  const companyInitials = getCompanyInitials(companyName);
  const salaryLabel = formatSalary(job);
  const postedDate = formatPostedDate(job.posted_date ?? null, "en-LK");

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

  const benefits = useMemo(
    () => normalizeMultilineValues(job.benefits),
    [job.benefits]
  );

  const skills = useMemo(
    () => normalizeMultilineValues(job.skills),
    [job.skills]
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <article className="ui-card p-5 sm:p-6 lg:p-8">
        <header className="border-b border-border/70 pb-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border bg-muted/40 sm:size-20">
              <OptimizedImage
                src={job.company?.logo_url}
                fallbackSrc="/globe.svg"
                fallbackContent={
                  <div className="grid h-full w-full place-items-center bg-primary/10 text-sm font-semibold text-primary sm:text-base">
                    {companyInitials}
                  </div>
                }
                alt={`${companyName} logo`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl lg:text-4xl">
                {job.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground sm:text-base">
                  <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="font-medium text-card-foreground">{companyName}</span>
                </p>
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {isRemoteJob(job) ? "Remote" : job.location || "Sri Lanka"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl border border-border bg-background/50 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="ui-label">Posted</p>
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-card-foreground">
                <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                {postedDate}
              </p>
            </div>
            <div className="space-y-1">
              <p className="ui-label">Job Type</p>
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-card-foreground">
                <Briefcase className="h-4 w-4 text-primary" aria-hidden="true" />
                {job.job_type || job.employment_type || "Not specified"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="ui-label">Work Mode</p>
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-card-foreground">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                {getWorkModeLabel(job)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="ui-label">Salary</p>
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-card-foreground">
                <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
                {salaryLabel}
              </p>
            </div>
          </div>
        </header>

        {job.description ? (
          <section className="mt-8">
            <h2 className="ui-section-title">Job Description</h2>
            <div className="ui-reading mt-4 max-w-none whitespace-pre-line leading-relaxed">
              {job.description}
            </div>
          </section>
        ) : null}

        {requirements.length > 0 ? (
          <section className="mt-8">
            <h2 className="ui-section-title">Requirements</h2>
            <ul className="mt-4 space-y-2.5" role="list">
              {requirements.map((item, index) => (
                <li
                  key={`req-${index}`}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {responsibilities.length > 0 ? (
          <section className="mt-8">
            <h2 className="ui-section-title">Responsibilities</h2>
            <ul className="mt-4 space-y-2.5" role="list">
              {responsibilities.map((item, index) => (
                <li
                  key={`resp-${index}`}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {skills.length > 0 ? (
          <section className="mt-8">
            <h2 className="ui-section-title">Required Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`skill-${index}`}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-card-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {benefits.length > 0 ? (
          <section className="mt-8">
            <h2 className="ui-section-title">Benefits</h2>
            <ul className="mt-4 space-y-2.5" role="list">
              {benefits.map((item, index) => (
                <li
                  key={`benefit-${index}`}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        <section className="ui-card p-5 sm:p-6">
          <h2 className="ui-card-title">Apply for this Role</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Take the first step towards your new career. The apply button will unlock after a brief
            countdown to ensure genuine interest.
          </p>

          <div className="mt-5">
            <ApplyButton
              jobId={job.id}
              jobTitle={job.title}
              applyTarget={applyTarget}
              initialAppliedCount={job.applied_count ?? 0}
              countdownSeconds={APPLY_LOCK_SECONDS}
            />
          </div>
        </section>

        <AdSlotPlaceholder label="Sponsored" />

        <section className="ui-card p-5">
          <h2 className="ui-card-title">About the Employer</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="ui-label">Company</dt>
              <dd className="mt-1 font-medium text-card-foreground">{companyName}</dd>
            </div>
            <div>
              <dt className="ui-label">Category</dt>
              <dd className="mt-1 text-card-foreground">{job.category?.name || "General"}</dd>
            </div>
            <div>
              <dt className="ui-label">Location</dt>
              <dd className="mt-1 text-card-foreground">{job.location || "Sri Lanka"}</dd>
            </div>
            {job.company?.website ? (
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
            ) : null}
          </dl>
        </section>
      </aside>
    </section>
  );
}
