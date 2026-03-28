"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

const COOKIE_STORAGE_KEY = "seekjobs-cookie-notice";
const EXIT_DURATION_MS = 220;

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const consent = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    if (consent === "accepted") return;

    const mountTimer = window.setTimeout(() => setMounted(true), 0);
    const revealTimer = window.setTimeout(() => setVisible(true), 600);

    return () => {
      window.clearTimeout(mountTimer);
      window.clearTimeout(revealTimer);
    };
  }, []);

  const hideNotice = (status: "accepted" | "dismissed") => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, status);
    }

    setVisible(false);

    window.setTimeout(() => {
      setMounted(false);
    }, EXIT_DURATION_MS);
  };

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:px-6 sm:pb-6",
        visible ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/20 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
        onClick={() => hideNotice("dismissed")}
      />

      <div className="w-full max-w-4xl">
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie notice"
          aria-modal="false"
          className={cn(
            "ui-toast relative w-full overflow-hidden px-5 py-5 transition-all duration-200 sm:px-6",
            visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0",
          )}
        >
          <button
            type="button"
            onClick={() => hideNotice("dismissed")}
            className="ui-button ui-button-ghost absolute right-3 top-3 h-10 w-10 px-0"
            aria-label="Close cookie notice"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-primary/10 text-primary">
                <Cookie className="h-7 w-7" />
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-base font-semibold text-card-foreground">We value your privacy</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We use cookies to improve your browsing experience and measure job page visits.
                By continuing, you agree to our{" "}
                <a
                  href="/privacy-policy"
                  className="font-medium text-foreground underline decoration-primary/60 underline-offset-4 hover:decoration-primary"
                >
                  cookie policy
                </a>
                .
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:self-center">
              <Button size="sm" onClick={() => hideNotice("accepted")}>
                Accept
              </Button>

              <Button size="sm" variant="secondary" onClick={() => hideNotice("dismissed")}>
                Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
