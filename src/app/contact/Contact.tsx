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

        <section className="border-b border-border/70 bg-background">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Contact <span className="text-primary">SeekJobsLk</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Need help or have feedback? Reach our team and we will get back to you as soon as possible.
            </p>
          </div>
        </section>

        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <section className="space-y-4">
              <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="text-base font-semibold text-card-foreground">Email Support</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Contact us for listings, reporting issues, or general platform questions.
                </p>
                <a
                  href="mailto:hello@seekjobslk.com"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  hello@seekjobslk.com
                </a>
              </article>

              <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-base font-semibold text-card-foreground">Response Time</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We typically respond within 24-48 hours on business days.
                </p>
              </article>

              <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h2 className="text-base font-semibold text-card-foreground">Important Notice</h2>
                <p className="mt-2 text-sm text-muted-foreground">
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
