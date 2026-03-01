"use client";

import { Clock, HelpCircle, Mail } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ConnectWithUs } from "@/components/ConnectWithUs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Contact() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Helmet>
          <title>Contact Us | SeekJobsLk</title>
          <meta
            name="description"
            content="Get in touch with SeekJobsLk for support, questions, and platform-related inquiries."
          />
        </Helmet>

        <Navbar />

        <section className="border-b border-border/80 bg-background/70">
          <div className="ui-shell ui-shell-narrow py-14 text-center sm:py-16">
            <span className="ui-kicker mx-auto">Contact the team</span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Contact <span className="text-primary">SeekJobsLk</span>
            </h1>
            <p className="ui-page-intro mx-auto mt-4 text-center">
              Need help or have feedback? Reach our team and we will get back to you as soon as possible.
            </p>
          </div>
        </section>

        <main className="ui-shell ui-shell-narrow py-10 sm:py-12">
          <div className="grid gap-6 md:grid-cols-2">
            <section className="space-y-4">
              <article className="ui-card ui-card-hover p-5 sm:p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="ui-card-title">Email Support</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Contact us for listings, reporting issues, or general platform questions.
                </p>
                <a
                  href="mailto:hello@seekjobslk.com"
                  className="mt-4 inline-flex text-sm font-semibold text-foreground underline decoration-primary/60 underline-offset-4 hover:decoration-primary"
                >
                  hello@seekjobslk.com
                </a>
              </article>

              <article className="ui-card ui-card-hover p-5 sm:p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="ui-card-title">Response Time</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  We typically respond within 24-48 hours on business days.
                </p>
              </article>

              <article className="ui-card ui-card-hover p-5 sm:p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h2 className="ui-card-title">Important Notice</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  SeekJobsLk is not a recruitment agency. We do not charge fees for applications and do not
                  guarantee hiring outcomes.
                </p>
              </article>
            </section>

            <section>
              <ConnectWithUs />
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
