import React, { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "seekjobslk_cookie_consent";

const CookieNotice: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setTimeout(() => setVisible(true), 400);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const closeNotice = () => {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setVisible(false);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-500 ease-out
        ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}
    >
      <div className="mx-auto max-w-5xl px-3 pb-3">
        <div className="relative rounded-2xl border bg-card shadow-xl overflow-hidden">
          {/* Close icon */}
          <button
            onClick={closeNotice}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            aria-label="Close cookie notice"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row gap-4 p-5 sm:p-6">
            {/* Icon */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 animate-bounce">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1">
                We value your privacy 🍪
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use cookies to improve your experience, analyze traffic, and
                show relevant job opportunities. By continuing, you agree to our{" "}
                <a
                  href="/privacy-policy"
                  className="underline underline-offset-2 hover:text-primary"
                >
                  cookie policy
                </a>.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 sm:ml-auto sm:self-center">
              <Button size="sm" onClick={acceptCookies}>
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={closeNotice}>
                Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieNotice;
