import React, { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "seekjobslk_cookie_consent";

const CookieNotice: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);

    if (consent === "accepted") return;

    setMounted(true);
    const timer = setTimeout(() => setVisible(true), 600);

    return () => clearTimeout(timer);
  }, []);

  const hideNotice = (status: "accepted" | "dismissed") => {
    localStorage.setItem(STORAGE_KEY, status);

    setVisible(false);

    setTimeout(() => {
      setMounted(false);
    }, 600);
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 transform transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${visible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-12 opacity-0 scale-95"
        }
      `}
    >
      <div className="mx-auto max-w-5xl px-3 pb-4">
        <div
          className="
      relative rounded-2xl overflow-hidden
      bg-primary/90 text-white
      backdrop-blur-md
      border border-white/15
      shadow-[0_20px_50px_rgba(0,0,0,0.25)]
    "
        >
          <button
            onClick={() => hideNotice("dismissed")}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
            aria-label="Close cookie notice"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row gap-4 p-6">
            <div className="flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 border border-white/20">
                <Cookie className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1">
                We value your privacy 🍪
              </h4>
              <p className="text-sm text-white/80 leading-relaxed">
                We use cookies to improve your experience, analyze traffic, and show
                relevant job opportunities. By continuing, you agree to our{" "}
                <a
                  href="/privacy-policy"
                  className="underline underline-offset-2 hover:text-white"
                >
                  cookie policy
                </a>.
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
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default CookieNotice;
