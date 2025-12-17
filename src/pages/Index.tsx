import React, { useState, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import FilterSection, { FilterState } from "@/components/FilterSection";
import JobList from "@/components/JobList";
import ConnectWithUs from "@/components/ConnectWithUs";
import PageViewsCounter from "@/components/PageViewsCounter";
import type { Job } from "@/types";
import { getJobs } from "@/services/firebaseData";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";
import PopularJobsAside from "@/components/PopularJobsAside";
import CookieNotice from "@/components/CookieNotice";

const Index: React.FC = () => {
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
        <>
            <Helmet>
                <title>SeekJobsLk - Find Your Dream Job in Sri Lanka</title>
                <meta
                    name="description"
                    content="Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies."
                />
                <link rel="canonical" href="https://seekjobslk.com" />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="container mx-auto px-4 py-6 md:py-8">
                    {/* 🔹 MOBILE FILTER (TOP) */}
                    <div className="mb-4 lg:hidden">
                        <FilterSection
                            filters={filters}
                            onFilterChange={setFilters}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* 🔹 SIDEBAR (DESKTOP ONLY) */}
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

                        {/* 🔹 JOB LIST */}
                        <section className="lg:col-span-3">
                            {error && (
                                <div className="mb-4 rounded-lg border bg-amber-50 p-4 text-sm text-amber-900">
                                    {error}
                                </div>
                            )}

                            <JobList filters={filters} jobs={jobs} />

                            {isLoading && (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Loading the latest opportunities...
                                </p>
                            )}
                        </section>
                    </div>
                </main>

                <footer className="bg-card border-t mt-12">
                    <div className="container mx-auto px-4 py-8 text-center">
                        <p className="text-muted-foreground text-sm">
                            © {new Date().getFullYear()} SeekJobsLk. All rights reserved.
                        </p>
                        <p className="text-muted-foreground text-xs mt-2">
                            Your trusted job portal in Sri Lanka
                        </p>
                    </div>
                </footer>
                <CookieNotice />
            </div>
        </>
    );
};

export default Index;
