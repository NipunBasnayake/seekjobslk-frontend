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

        <section className="border-b border-border/80 bg-background/70">
          <div className="ui-shell ui-shell-narrow py-14 text-center sm:py-16">
            <span className="ui-kicker mx-auto">About the platform</span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              About <span className="text-primary">SeekJobsLk</span>
            </h1>
            <p className="ui-page-intro mx-auto mt-4 text-center">
              A clean and trusted platform to discover quality opportunities in Sri Lanka.
            </p>
          </div>
        </section>

        <main className="ui-shell ui-shell-narrow space-y-8 py-10 sm:space-y-10 sm:py-12">
          <section className="ui-card p-6 sm:p-7">
            <h2 className="ui-section-title">Who We Are</h2>
            <p className="ui-reading mt-3 max-w-none">
              SeekJobsLk is a Sri Lanka-focused job portal built to simplify how people find work and how
              companies connect with talent. We organize job opportunities in one place so applicants can
              quickly discover relevant openings and apply directly through official employer channels.
            </p>
          </section>

          <section className="ui-card p-6 sm:p-7">
            <h2 className="ui-section-title">Our Mission</h2>
            <p className="ui-reading mt-3 max-w-none">
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
                  className="ui-card ui-card-hover p-5 sm:p-6"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="ui-card-title">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </article>
              );
            })}
          </section>

          <section className="ui-card p-6 sm:p-7">
            <h2 className="ui-section-title">Transparency & Disclaimer</h2>
            <p className="ui-reading mt-3 max-w-none">
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
