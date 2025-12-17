import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import FilterSection, { FilterState } from '@/components/FilterSection';
import JobList from '@/components/JobList';
import ConnectWithUs from '@/components/ConnectWithUs';
import PageViewsCounter from '@/components/PageViewsCounter';
import type { Job } from "@/types";
import { getJobs } from '@/services/firebaseData';
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";
import PopularJobsAside from '@/components/PopularJobsAside';

const Index: React.FC = () => {
    const [jobs, setJobs] = useState<Job[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        companies: [],
        jobTypes: [],
        salaryRange: [0, 500000],
        location: '',
    });

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedJobs = await getJobs();

                const sortedJobs = [...fetchedJobs].sort(
                    (a, b) => b.posted_date.toDate().getTime() - a.posted_date.toDate().getTime()
                );
                setJobs(sortedJobs);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('We could not load the latest jobs right now. Showing recent listings.');
                setJobs(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);


    const handleCategorySelect = useCallback((categoryId: string) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories
                : [...prev.categories, categoryId],
        }));
    }, []);

    const handleCompanySelect = useCallback((companyId: string) => {
        setFilters(prev => ({
            ...prev,
            companies: prev.companies.includes(companyId)
                ? prev.companies
                : [...prev.companies, companyId],
        }));
    }, []);

    return (
        <>
            <Helmet>
                <title>SeekJobsLk - Find Your Dream Job in Sri Lanka</title>
                <meta name="description"
                    content="Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies across multiple industries. Apply now and start your career journey." />
                <meta property="og:title" content="SeekJobsLk - Find Your Dream Job in Sri Lanka" />
                <meta property="og:description"
                    content="Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://seekjobslk.com" />
            </Helmet>


            <div className="min-h-screen bg-background transition-colors duration-300">
                <Navbar/>

                <main className="container mx-auto px-4 py-6 md:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <aside className="lg:col-span-1 space-y-5 order-2 lg:order-1">
                            <WhatsAppChannelBanner />
                            <FilterSection filters={filters} onFilterChange={setFilters} />
                            <PopularJobsAside jobs={jobs} />
                            <ConnectWithUs />
                            <PageViewsCounter />
                        </aside>

                        <section className="lg:col-span-3 order-1 lg:order-2">
                            {error && (
                                <div
                                    className="mb-4 rounded-lg border border-border bg-amber-50 text-amber-900 p-4 text-sm">
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

                <footer className="bg-card border-t border-border mt-12">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center">
                            <p className="text-muted-foreground text-sm">
                                © {new Date().getFullYear()} SeekJobsLk. All rights reserved.
                            </p>
                            <p className="text-muted-foreground text-xs mt-2">
                                Your trusted job portal in Sri Lanka
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Index;
