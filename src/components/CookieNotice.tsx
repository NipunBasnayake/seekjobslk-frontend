"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_STORAGE_KEY = "seekjobs-cookie-notice";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const consent = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    if (consent === "accepted") return;

    setMounted(true);
    const timer = window.setTimeout(() => setVisible(true), 600);

    return () => window.clearTimeout(timer);
  }, []);

  const hideNotice = (status: "accepted" | "dismissed") => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, status);
    }

    setVisible(false);

    window.setTimeout(() => {
      setMounted(false);
    }, 600);
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 transform transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          visible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-12 opacity-0 scale-95"
        }
      `}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
    >
      <div className="mx-auto max-w-5xl px-3 pb-4">
        <div
          className="
            relative overflow-hidden rounded-2xl
            bg-primary/90 text-white
            backdrop-blur-md
            border border-white/15
            shadow-[0_20px_50px_rgba(0,0,0,0.25)]
          "
        >
          <button
            type="button"
            onClick={() => hideNotice("dismissed")}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition"
            aria-label="Close cookie notice"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-4 p-6 sm:flex-row">
            <div className="flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 border border-white/20">
                <Cookie className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h4 className="mb-1 text-sm font-semibold">We value your privacy 🍪</h4>
              <p className="text-sm text-white/80 leading-relaxed">
                We use cookies to improve your browsing experience and measure job page visits.
                By continuing, you agree to our{" "}
                <a
                  href="/privacy-policy"
                  className="underline underline-offset-2 hover:text-white"
                >
                  cookie policy
                </a>
                .
              </p>
            </div>

            <div className="flex gap-2 sm:ml-auto sm:self-center">
              <Button
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => hideNotice("accepted")}
              >
                Accept
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/15"
                onClick={() => hideNotice("dismissed")}
              >
                Later
              </Button>
            </div>
          </div>

          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-6px); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
