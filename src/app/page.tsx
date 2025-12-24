"use client";

import { useState, useEffect } from "react";
import type { Job } from "@/types";
import { getJobs } from "@/services/firebaseData";

import FilterSection, { FilterState } from "@/components/FilterSection";
import JobList from "@/components/JobList";
import PopularJobsAside from "@/components/PopularJobsAside";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";
import ConnectWithUs from "@/components/ConnectWithUs";
import PageViewsCounter from "@/components/PageViewsCounter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieNotice from "@/components/CookieNotice";

export default function Home() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    companies: [],
    jobTypes: [],
    salaryRange: [0, 500000],
    location: "all",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedJobs = await getJobs();
        const sortedJobs = [...fetchedJobs].sort(
          (a, b) =>
            b.posted_date.toDate().getTime() -
            a.posted_date.toDate().getTime()
        );
        setJobs(sortedJobs);
      } catch (err) {
        console.error(err);
        setError(
          "We could not load the latest jobs right now. Showing recent listings."
        );
        setJobs(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Mobile Filter */}
        <div className="lg:hidden mb-6 space-y-4">
          <WhatsAppChannelBanner />
          <FilterSection filters={filters} onFilterChange={setFilters} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-5">
            <WhatsAppChannelBanner />
            <FilterSection filters={filters} onFilterChange={setFilters} />
            <PopularJobsAside jobs={jobs} />
            <ConnectWithUs />
            <PageViewsCounter />
          </aside>

          {/* Job List */}
          <section className="lg:col-span-3 space-y-4">
            {error && (
              <div className="rounded-lg border bg-amber-50 p-4 text-sm text-amber-900">
                {error}
              </div>
            )}

            <JobList filters={filters} jobs={jobs} />
          </section>
        </div>

        {/* Mobile Popular Jobs */}
        <div className="lg:hidden mt-8 space-y-4">
          <PopularJobsAside jobs={jobs} />
          <PageViewsCounter />
          <ConnectWithUs />
        </div>
      </main>

      <Footer />
      <CookieNotice />
    </div>
  );
}
