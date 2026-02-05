"use client";

import { Briefcase, ExternalLink, FileText, RefreshCcw, UserCheck } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Terms() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Helmet>
          <title>Terms & Conditions | SeekJobsLk</title>
          <meta
            name="description"
            content="Review SeekJobsLk terms covering job listings, applications, user responsibilities, and external links."
          />
        </Helmet>

        <Navbar />

        <section className="border-b border-border/70 bg-background">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <FileText className="h-3.5 w-3.5" />
              Please Read Carefully
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Terms & Conditions
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              These terms govern your access to and use of the SeekJobsLk platform.
            </p>
          </div>
        </section>

        <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Introduction</h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              By accessing or using SeekJobsLk, you agree to these Terms & Conditions. If you do not agree,
              please discontinue use of the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              Job Listings & Applications
            </h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              SeekJobsLk aggregates and displays opportunities from employers and trusted sources. We are not
              the hiring organization and do not make employment decisions. Applications are submitted directly
              through employer-provided channels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-foreground">
              <UserCheck className="h-5 w-5 text-primary" />
              User Responsibilities
            </h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              Users are responsible for verifying job authenticity, eligibility requirements, and employer
              communications before taking action. SeekJobsLk is not liable for losses, disputes, or decisions
              made based on third-party listings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-foreground">
              <ExternalLink className="h-5 w-5 text-primary" />
              External Links
            </h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              The platform may include links to external employer websites and services. We do not control or
              endorse the content, security, or privacy practices of third-party websites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-foreground">
              <RefreshCcw className="h-5 w-5 text-primary" />
              Changes to These Terms
            </h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              We may revise these Terms & Conditions at any time. Continued use of SeekJobsLk after updates
              means you accept the revised terms.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm leading-6 text-muted-foreground">
              Effective date: February 4, 2026. Please review this page periodically for updates before using
              the platform.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
