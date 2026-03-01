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

        <section className="border-b border-border/80 bg-background/70">
          <div className="ui-shell ui-shell-reading py-14 text-center sm:py-16">
            <span className="ui-kicker mx-auto">
              <FileText className="h-3.5 w-3.5" />
              Please Read Carefully
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Terms & Conditions
            </h1>
            <p className="ui-page-intro mx-auto mt-4 text-center">
              These terms govern your access to and use of the SeekJobsLk platform.
            </p>
          </div>
        </section>

        <main className="ui-shell ui-shell-reading space-y-8 py-10 sm:py-12">
          <section className="space-y-3">
            <h2 className="ui-section-title">Introduction</h2>
            <p className="ui-reading max-w-none">
              By accessing or using SeekJobsLk, you agree to these Terms & Conditions. If you do not agree,
              please discontinue use of the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="ui-section-title inline-flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Job Listings & Applications
            </h2>
            <p className="ui-reading max-w-none">
              SeekJobsLk aggregates and displays opportunities from employers and trusted sources. We are not
              the hiring organization and do not make employment decisions. Applications are submitted directly
              through employer-provided channels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="ui-section-title inline-flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              User Responsibilities
            </h2>
            <p className="ui-reading max-w-none">
              Users are responsible for verifying job authenticity, eligibility requirements, and employer
              communications before taking action. SeekJobsLk is not liable for losses, disputes, or decisions
              made based on third-party listings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="ui-section-title inline-flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              External Links
            </h2>
            <p className="ui-reading max-w-none">
              The platform may include links to external employer websites and services. We do not control or
              endorse the content, security, or privacy practices of third-party websites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="ui-section-title inline-flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-primary" />
              Changes to These Terms
            </h2>
            <p className="ui-reading max-w-none">
              We may revise these Terms & Conditions at any time. Continued use of SeekJobsLk after updates
              means you accept the revised terms.
            </p>
          </section>

          <section className="ui-card p-5 sm:p-6">
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
