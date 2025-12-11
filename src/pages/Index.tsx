import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import FilterSection, { FilterState } from '@/components/FilterSection';
import JobList from '@/components/JobList';
import ConnectWithUs from '@/components/ConnectWithUs';
import PageViewsCounter from '@/components/PageViewsCounter';

const Index: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    companies: [],
    jobTypes: [],
    salaryRange: [0, 500000],
    location: '',
  });

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
        <meta name="description" content="Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies across multiple industries. Apply now and start your career journey." />
        <meta property="og:title" content="SeekJobsLk - Find Your Dream Job in Sri Lanka" />
        <meta property="og:description" content="Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://seekjobslk.com" />
      </Helmet>

      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navbar 
          onCategorySelect={handleCategorySelect}
          onCompanySelect={handleCompanySelect}
        />

        <main className="container mx-auto px-4 py-6 md:py-8">
          {/* Hero Section */}
          <header className="text-center mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-heading mb-3">
              Find Your <span className="text-gradient">Dream Job</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover amazing career opportunities from top companies across Sri Lanka
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-5 order-2 lg:order-1">
              <FilterSection filters={filters} onFilterChange={setFilters} />
              <ConnectWithUs />
              <PageViewsCounter />
            </aside>

            {/* Main Content */}
            <section className="lg:col-span-3 order-1 lg:order-2">
              <JobList filters={filters} />
            </section>
          </div>
        </main>

        {/* Footer */}
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
