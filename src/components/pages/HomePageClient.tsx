"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FilterSection, { FilterState } from "@/components/FilterSection";
import JobList from "@/components/JobList";
import ConnectWithUs from "@/components/ConnectWithUs";
import PageViewsCounter from "@/components/PageViewsCounter";
import type { Job } from "@/types";
import { getJobs } from "@/services/firebaseData";
import { getJobTimestamp } from "@/lib/jobUtils";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";
import PopularJobsAside from "@/components/PopularJobsAside";
import CookieNotice from "@/components/CookieNotice";
import Footer from "@/components/Footer";

interface HomePageClientProps {
    initialJobs: Job[] | null;
}

const Index: React.FC<HomePageClientProps> = ({ initialJobs }) => {
    const [jobs, setJobs] = useState<Job[] | null>(initialJobs);
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
            setError(null);
            try {
                const fetchedJobs = await getJobs();
                const sortedJobs = [...fetchedJobs].sort(
                    (a, b) => getJobTimestamp(b.posted_date) - getJobTimestamp(a.posted_date)
                );
                setJobs(sortedJobs);
            } catch (err) {
                console.error(err);
                setError(
                    "We could not load the latest jobs right now. Showing recent listings."
                );
                setJobs(null);
            } finally {
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
                <main className="container mx-auto px-4 py-6 md:py-8">
                    <div className="lg:hidden mb-6 space-y-4">
                        <WhatsAppChannelBanner />
                        <FilterSection
                            filters={filters}
                            onFilterChange={setFilters}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <aside className="hidden lg:block lg:col-span-1 space-y-5">
                            <WhatsAppChannelBanner />
                            <FilterSection
                                filters={filters}
                                onFilterChange={setFilters}
                            />
                            <PopularJobsAside jobs={jobs} />
                            <ConnectWithUs />
                            <PageViewsCounter />
                        </aside>

                        <section className="lg:col-span-3 space-y-4">
                            {error && (
                                <div className="rounded-lg border bg-amber-50 p-4 text-sm text-amber-900">
                                    {error}
                                </div>
                            )}

                            <JobList filters={filters} jobs={jobs} />
                        </section>
                    </div>

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
};

export default Index;
