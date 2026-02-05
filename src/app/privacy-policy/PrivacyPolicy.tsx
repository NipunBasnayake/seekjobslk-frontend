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

        <section className="border-b border-border/70 bg-background">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Your Privacy Matters
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              This policy explains how we use information, cookies, and third-party services on SeekJobsLk.
            </p>
          </div>
        </section>

        <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
          <section className="space-y-3">
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              At SeekJobsLk, we value your trust. This Privacy Policy explains what information may be
              collected while you browse our Sri Lanka-focused job portal and how that information may be
              used to improve your experience.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-foreground">
              <CheckCircle className="h-5 w-5 text-primary" />
              Information We Collect
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground sm:text-base">
              <li>Basic usage data such as pages visited, device/browser type, and visit timing.</li>
              <li>Information shared voluntarily through direct contact (for example email support).</li>
              <li>Analytics data used to improve platform performance and content relevance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-foreground">
              <Cookie className="h-5 w-5 text-primary" />
              Cookies & Advertising
            </h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              We may use cookies to remember preferences and understand traffic patterns. Third-party vendors,
              including Google, may use cookies (such as the DART cookie) to show relevant ads based on your
              browsing activity. You can opt out of personalized advertising through Google Ads Settings or by
              managing cookies in your browser.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-foreground">
              <ExternalLink className="h-5 w-5 text-primary" />
              Third-Party Links
            </h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              SeekJobsLk may contain links to external websites, employer portals, or services. We are not
              responsible for the privacy practices or content of third-party sites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Consent</h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              By using this website, you consent to this Privacy Policy and agree to its terms.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
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
