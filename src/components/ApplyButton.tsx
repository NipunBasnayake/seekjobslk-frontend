"use client";

import { Check, Clock, Copy, ExternalLink, Loader2, Mail, Phone } from "lucide-react";
import { useCallback, useState } from "react";
import { Modal } from "@/components/Modal";
import type { ApplyTarget } from "@/lib/applyTarget";
import { useApplyCountdown } from "@/hooks/useApplyCountdown";
import { cn } from "@/lib/cn";

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  applyTarget: ApplyTarget;
  initialAppliedCount?: number;
  countdownSeconds?: number;
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

export function ApplyButton({
  jobId,
  jobTitle,
  applyTarget,
  initialAppliedCount = 0,
  countdownSeconds = 10,
}: ApplyButtonProps) {
  const [appliedCount, setAppliedCount] = useState(initialAppliedCount);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const { secondsLeft, isLocked, progress } = useApplyCountdown({
    initialSeconds: countdownSeconds,
  });

  const canApply = !isLocked && applyTarget.kind !== "none";

  const handleApply = useCallback(async () => {
    if (!canApply || isApplying) return;

    setIsApplying(true);
    setAppliedCount((v) => v + 1);
    void trackApply(jobId);

    if (applyTarget.kind === "url") {
      // Check if URL is safe before opening
      try {
        const url = new URL(applyTarget.url);
        if (url.protocol === "http:" || url.protocol === "https:") {
          window.open(applyTarget.url, "_blank", "noopener,noreferrer");
        }
      } catch {
        // Invalid URL, do nothing
      }
    } else if (applyTarget.kind === "email" || applyTarget.kind === "phone") {
      setContactModalOpen(true);
    }

    setIsApplying(false);
  }, [canApply, isApplying, jobId, applyTarget]);

  const handleCopy = useCallback(async () => {
    if (applyTarget.kind !== "email" && applyTarget.kind !== "phone") return;

    const value = applyTarget.kind === "email" ? applyTarget.email : applyTarget.phone;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [applyTarget]);

  // Calculate SVG circle properties for countdown ring
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const getButtonLabel = () => {
    if (applyTarget.kind === "none") {
      return "No application method";
    }
    if (isLocked) {
      return `Apply in ${secondsLeft}s`;
    }
    return "Apply Now";
  };

  const getButtonIcon = () => {
    if (isLocked) {
      return (
        <div className="relative h-10 w-10 flex items-center justify-center">
          <svg className="countdown-ring absolute inset-0 h-10 w-10" viewBox="0 0 40 40">
            <circle className="countdown-ring-track" cx="20" cy="20" r={radius} />
            <circle
              className="countdown-ring-progress"
              cx="20"
              cy="20"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="text-xs font-bold">{secondsLeft}</span>
        </div>
      );
    }
    if (isApplying) {
      return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    return <ExternalLink className="h-5 w-5" />;
  };

  const contactValue =
    applyTarget.kind === "email"
      ? applyTarget.email
      : applyTarget.kind === "phone"
        ? applyTarget.phone
        : "";

  const contactHref =
    applyTarget.kind === "email"
      ? applyTarget.mailto
      : applyTarget.kind === "phone"
        ? applyTarget.tel
        : "";

  return (
    <>
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleApply}
          disabled={!canApply}
          aria-disabled={!canApply}
          aria-label={canApply ? `Apply for ${jobTitle}` : `Apply available in ${secondsLeft} seconds`}
          className={cn(
            "ui-button w-full justify-center gap-3 py-4 text-base",
            isLocked && "apply-button-locked",
            canApply ? "ui-button-primary" : "ui-button-secondary opacity-80"
          )}
        >
          {getButtonIcon()}
          <span>{getButtonLabel()}</span>
        </button>

        {isLocked ? (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200/50 bg-amber-50/50 p-3 dark:border-amber-800/30 dark:bg-amber-900/10">
            <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Apply button activates in <strong>{secondsLeft} seconds</strong>. This helps prevent
              accidental clicks and verify genuine interest.
            </p>
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            Applications started:{" "}
            <span className="font-semibold text-card-foreground">{appliedCount}</span>
          </p>
        )}
      </div>

      {(applyTarget.kind === "email" || applyTarget.kind === "phone") ? (
        <Modal
          open={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          title={applyTarget.kind === "email" ? "Apply via Email" : "Apply via Phone"}
          description={
            applyTarget.kind === "email"
              ? "Use the email below to send your application."
              : "Use the phone number below to contact the recruiter."
          }
        >
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="break-all text-center text-lg font-semibold text-card-foreground">
              {contactValue}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="ui-button ui-button-secondary"
              aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>

            <a href={contactHref} className="ui-button ui-button-primary">
              {applyTarget.kind === "email" ? (
                <>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Open Email App
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call Now
                </>
              )}
            </a>
          </div>

          {copied ? (
            <p
              className="mt-3 text-center text-sm text-green-600"
              role="status"
              aria-live="polite"
            >
              Contact information copied to clipboard
            </p>
          ) : null}
        </Modal>
      ) : null}
    </>
  );
}
