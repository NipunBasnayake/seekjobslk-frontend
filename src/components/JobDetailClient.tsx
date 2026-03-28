"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Wallet,
  X,
} from "lucide-react";
import { AdSlotPlaceholder } from "@/components/AdSlotPlaceholder";
import { OptimizedImage } from "@/components/OptimizedImage";
import { parseApplyTarget } from "@/lib/applyTarget";
import { getApplyButtonState } from "@/lib/applyUi";
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

async function trackApply(jobId: string) {
  try {
    await fetch(`/api/jobs/${encodeURIComponent(jobId)}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    // Ignore analytics failures to keep apply UX uninterrupted.
  }
}

export function JobDetailClient({ job }: JobDetailClientProps) {
  const [appliedCount, setAppliedCount] = useState(job.applied_count ?? 0);
  const [secondsLeft, setSecondsLeft] = useState(APPLY_LOCK_SECONDS);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const benefits = useMemo(() => normalizeMultilineValues(job.benefits), [job.benefits]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((currentValue) => Math.max(0, currentValue - 1));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [secondsLeft]);

  useEffect(() => {
    if (!contactModalOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContactModalOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [contactModalOpen]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copied]);

  const applyButtonState = getApplyButtonState(applyTarget, secondsLeft);
  const canApply = applyButtonState.canApply;

  const handleApply = () => {
    if (!canApply) {
      return;
    }

    setAppliedCount((currentValue) => currentValue + 1);
    void trackApply(job.id);

    if (applyTarget.kind === "url") {
      window.open(applyTarget.url, "_blank", "noopener,noreferrer");
      return;
    }

    setContactModalOpen(true);
  };

  const handleCopy = async () => {
    if (applyTarget.kind !== "email" && applyTarget.kind !== "phone") {
      return;
    }

    const value = applyTarget.kind === "email" ? applyTarget.email : applyTarget.phone;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="ui-card p-5 sm:p-6 lg:p-7">
          <header className="border-b border-border/70 pb-6">
            <div className="flex items-start gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border bg-muted/40">
                <OptimizedImage
                  src={job.company?.logo_url}
                  fallbackSrc="/globe.svg"
                  fallbackContent={
                    <div className="grid h-full w-full place-items-center bg-primary/10 text-sm font-semibold text-primary">
                      {companyInitials}
                    </div>
                  }
                  alt={`${companyName} logo`}
                  width={64}
                  height={64}
                  className="h-full w-full"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl">
                  {job.title}
                </h1>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  {companyName}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isRemoteJob(job) ? "Remote" : job.location || "Sri Lanka"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl border border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="ui-label">Posted</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-card-foreground">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {postedDate}
                </p>
              </div>
              <div>
                <p className="ui-label">Job Type</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-card-foreground">
                  <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {job.job_type || job.employment_type || "N/A"}
                </p>
              </div>
              <div>
                <p className="ui-label">Work Mode</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-card-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {getWorkModeLabel(job)}
                </p>
              </div>
              <div>
                <p className="ui-label">Salary</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-card-foreground">
                  <Wallet className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {salaryLabel}
                </p>
              </div>
            </div>
          </header>

          {job.description ? (
            <section className="mt-8">
              <h2 className="ui-section-title">Job Description</h2>
              <p className="ui-reading mt-3 max-w-none whitespace-pre-line">{job.description}</p>
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
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <section className="ui-card p-5">
            <h2 className="ui-card-title">Apply for this role</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We delay the apply button for 10 seconds to reduce accidental taps and bot abuse.
            </p>

            <button
              type="button"
              onClick={handleApply}
              disabled={!canApply}
              aria-disabled={!canApply}
              aria-label={canApply ? `Apply for ${job.title}` : `Apply unavailable for ${job.title}`}
              className="ui-button ui-button-primary mt-4 w-full justify-center"
            >
              {applyButtonState.label}
            </button>

            {applyButtonState.showCountdownHelper ? (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                Button unlocks automatically after countdown.
              </p>
            ) : null}

            <p className="mt-3 text-xs text-muted-foreground">
              Applications started: <span className="font-semibold text-card-foreground">{appliedCount}</span>
            </p>
          </section>

          <AdSlotPlaceholder label="Sponsored section" />

          <section className="ui-card p-5">
            <h2 className="ui-card-title">Quick facts</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="ui-label">Category</dt>
                <dd className="mt-1 text-card-foreground">{job.category?.name || "General"}</dd>
              </div>
              <div>
                <dt className="ui-label">Location</dt>
                <dd className="mt-1 text-card-foreground">{job.location || "Sri Lanka"}</dd>
              </div>
              <div>
                <dt className="ui-label">Employer Site</dt>
                <dd className="mt-1">
                  {job.company?.website ? (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Visit website
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </section>

      {contactModalOpen && (applyTarget.kind === "email" || applyTarget.kind === "phone") ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4"
          role="presentation"
          onClick={() => setContactModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-contact-title"
            className="ui-card w-full max-w-md p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="apply-contact-title" className="ui-section-title">
                  {applyTarget.kind === "email" ? "Apply via email" : "Apply via phone"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {applyTarget.kind === "email"
                    ? "Use the email below to send your application."
                    : "Use the phone number below to contact the recruiter."}
                </p>
              </div>
              <button
                type="button"
                className="ui-button ui-button-ghost h-10 w-10 px-0"
                onClick={() => setContactModalOpen(false)}
                aria-label="Close apply contact modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-card-foreground break-all">
                {applyTarget.kind === "email" ? applyTarget.email : applyTarget.phone}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="ui-button ui-button-secondary"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Copied" : "Copy"}
              </button>

              {applyTarget.kind === "email" ? (
                <a href={applyTarget.mailto} className="ui-button ui-button-primary">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Open email app
                </a>
              ) : (
                <a href={applyTarget.tel} className="ui-button ui-button-primary">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call now
                </a>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
