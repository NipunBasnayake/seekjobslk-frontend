"use client";

import { Check, Copy, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { ContactModal } from "./ContactModal";
import type { ApplyTarget } from "@/lib/applyTarget";
import { useApplyCountdown } from "@/hooks/useApplyCountdown";
import { cn } from "@/lib/cn";

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  applyTarget: ApplyTarget;
  initialAppliedCount?: number;
  countdownSeconds?: number;
  onApplied?: () => void;
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
  countdownSeconds = 10,
  onApplied,
}: ApplyButtonProps) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const { secondsLeft, isLocked, progress } = useApplyCountdown({
    initialSeconds: countdownSeconds,
  });

  const hasApplicationMethod = applyTarget.kind !== "none";
  const canApply = !isLocked && hasApplicationMethod && !isApplying;

  const handleApply = useCallback(async () => {
    if (!canApply || isApplying) return;

    setIsApplying(true);
    let didProceed = false;

    if (applyTarget.kind === "url") {
      // Only open whitelisted browser protocols.
      try {
        const url = new URL(applyTarget.url);
        if (url.protocol === "http:" || url.protocol === "https:") {
          window.open(applyTarget.url, "_blank", "noopener,noreferrer");
          didProceed = true;
        }
      } catch {
        // Invalid URL. Keep UI stable and avoid hard failure.
      }
      if (didProceed) {
        if (typeof onApplied === "function") onApplied();
        void trackApply(jobId);
        setIsApplying(false);
      } else {
        setIsApplying(false);
      }
    } else if (applyTarget.kind === "email" || applyTarget.kind === "phone") {
      didProceed = true;
      if (typeof onApplied === "function") onApplied();
      void trackApply(jobId);
      setIsApplying(false);
      setContactModalOpen(true);
    } else {
      setIsApplying(false);
    }
  }, [canApply, isApplying, jobId, applyTarget, onApplied]);

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
  const progressPercent = Math.max(0, Math.min(100, Math.round(progress * 100)));

  const verificationMessage = useMemo(() => {
    if (!hasApplicationMethod) {
      return "No valid apply link, email, or phone number was provided for this listing.";
    }

    if (!isLocked) {
      return "Security checks passed. You can continue to the employer channel.";
    }

    if (progressPercent < 35) {
      return "Checking source quality and destination availability.";
    }

    if (progressPercent < 75) {
      return "Running secure handoff checks before enabling apply.";
    }

    return "Finalizing verification. Apply will be enabled shortly.";
  }, [hasApplicationMethod, isLocked, progressPercent]);

  const buttonLabel = (() => {
    if (!hasApplicationMethod) {
      return "Application method unavailable";
    }

    if (isApplying) {
      return "Opening application channel...";
    }

    if (isLocked) {
      return `Verifying job availability`;
    }

    // For email/phone
    return "Apply Now";
  })();

  // For bold rendering only when label is 'Apply Now'
  const buttonLabelNode = buttonLabel === "Apply Now" ? <strong>Apply Now</strong> : buttonLabel;

  const buttonIcon = (() => {
    if (isApplying) {
      return <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />;
    }

    if (isLocked) {
      return <ShieldCheck className="h-5 w-5" aria-hidden="true" />;
    }
  })();

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
        <div className="rounded-xl border border-primary/20 bg-primary-subtle/70 p-3.5">
          <div className="flex items-start gap-3">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-card">
              <svg className="countdown-ring absolute inset-0 h-14 w-14" viewBox="0 0 56 56">
                <circle className="countdown-ring-track" cx="28" cy="28" r={radius * 1.4} />
                <circle
                  className="countdown-ring-progress"
                  cx="28"
                  cy="28"
                  r={radius * 1.4}
                  strokeDasharray={circumference * 1.4}
                  strokeDashoffset={strokeDashoffset * 1.4}
                />
              </svg>
              <span className="text-[15px] font-semibold text-card-foreground">
                {hasApplicationMethod ? progressPercent : 0}%
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-card-foreground">
                {isLocked ? "Verifying job availability" : "Verification complete"}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {verificationMessage}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          disabled={!canApply}
          aria-disabled={!canApply}
          aria-label={canApply ? `Apply for ${jobTitle}` : buttonLabel}
          className={cn(
            "ui-button w-full justify-center gap-3 py-5 text-lg font-bold rounded-2xl shadow-md",
            isLocked && hasApplicationMethod && "apply-button-locked",
            canApply ? "ui-button-primary" : "ui-button-secondary opacity-90",
          )}
        >
          {buttonIcon}
          <span>{buttonLabelNode}</span>
        </button>
      </div>

      {(applyTarget.kind === "email" || applyTarget.kind === "phone") && (
        <ContactModal
          open={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          kind={applyTarget.kind}
          contactValue={contactValue}
          contactHref={contactHref}
          copied={copied}
          handleCopy={handleCopy}
        />
      )}
    </>
  );
}


