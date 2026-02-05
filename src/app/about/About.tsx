"use client";

import { Briefcase, Globe, ShieldCheck, Users } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const featureCards = [
  {
    title: "Verified Opportunities",
    description:
      "We prioritize quality by highlighting job posts from recognizable employers and trusted hiring sources.",
    icon: ShieldCheck,
  },
  {
    title: "Sri Lanka Focused",
    description:
      "Our platform is built for Sri Lankan job seekers, with listings relevant to local industries and regions.",
    icon: Globe,
  },
  {
    title: "Career-Centered Platform",
    description:
      "From entry-level roles to experienced positions, SeekJobsLk helps candidates discover meaningful career paths.",
    icon: Briefcase,
  },
  {
    title: "Community Driven",
    description:
      "We are building a reliable job ecosystem that supports job seekers, employers, and professionals across Sri Lanka.",
    icon: Users,
  },
];

export default function About() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Helmet>
          <title>About SeekJobsLk | Sri Lanka Job Portal</title>
          <meta
            name="description"
            content="Learn about SeekJobsLk, a Sri Lanka-focused job portal providing verified listings and direct employer application paths."
          />
        </Helmet>

        <Navbar />

        <section className="border-b border-border/70 bg-background">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              About <span className="text-primary">SeekJobsLk</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              A clean and trusted platform to discover quality opportunities in Sri Lanka.
            </p>
          </div>
        </section>

        <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Who We Are</h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              SeekJobsLk is a Sri Lanka-focused job portal built to simplify how people find work and how
              companies connect with talent. We organize job opportunities in one place so applicants can
              quickly discover relevant openings and apply directly through official employer channels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              Our mission is to provide clear, reliable, and accessible job information for everyone in Sri
              Lanka. We focus on verified listings, transparent job details, and a professional experience
              that helps job seekers make informed decisions.
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-card-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </article>
              );
            })}
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold text-card-foreground">Transparency & Disclaimer</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              SeekJobsLk is not a recruitment agency. We aggregate and present job opportunities, while all
              hiring decisions, interviews, and offers are handled by the respective employers. Applicants
              should always verify details before sharing personal or financial information.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
