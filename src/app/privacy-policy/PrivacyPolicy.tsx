"use client";

import { CheckCircle, Cookie, ExternalLink, ShieldCheck } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function PrivacyPolicy() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Helmet>
          <title>Privacy Policy | SeekJobsLk</title>
          <meta
            name="description"
            content="Read how SeekJobsLk handles personal information, cookies, advertising, and third-party services including Google."
          />
        </Helmet>

        <Navbar />

        <section className="border-b border-border/80 bg-background/70">
          <div className="ui-shell ui-shell-reading py-14 text-center sm:py-16">
            <span className="ui-kicker mx-auto">
              <ShieldCheck className="h-3.5 w-3.5" />
              Your Privacy Matters
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="ui-page-intro mx-auto mt-4 text-center">
              This policy explains how we use information, cookies, and third-party services on SeekJobsLk.
            </p>
          </div>
        </section>

        <main className="ui-shell ui-shell-reading space-y-8 py-10 sm:py-12">
          <section className="space-y-3">
            <p className="ui-reading max-w-none">
              At SeekJobsLk, we value your trust. This Privacy Policy explains what information may be
              collected while you browse our Sri Lanka-focused job portal and how that information may be
              used to improve your experience.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="ui-section-title inline-flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Information We Collect
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
              <li>Basic usage data such as pages visited, device/browser type, and visit timing.</li>
              <li>Information shared voluntarily through direct contact (for example email support).</li>
              <li>Analytics data used to improve platform performance and content relevance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="ui-section-title inline-flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              Cookies & Advertising
            </h2>
            <p className="ui-reading max-w-none">
              We may use cookies to remember preferences and understand traffic patterns. Third-party vendors,
              including Google, may use cookies (such as the DART cookie) to show relevant ads based on your
              browsing activity. You can opt out of personalized advertising through Google Ads Settings or by
              managing cookies in your browser.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="ui-section-title inline-flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Third-Party Links
            </h2>
            <p className="ui-reading max-w-none">
              SeekJobsLk may contain links to external websites, employer portals, or services. We are not
              responsible for the privacy practices or content of third-party sites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="ui-section-title">Consent</h2>
            <p className="ui-reading max-w-none">
              By using this website, you consent to this Privacy Policy and agree to its terms.
            </p>
          </section>

          <section className="ui-card p-5 sm:p-6">
            <p className="text-sm leading-6 text-muted-foreground">
              We may update this Privacy Policy from time to time. Please review this page periodically for
              changes. Last revised: February 4, 2026.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
