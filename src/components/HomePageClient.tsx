"use client";

import { useEffect, useMemo, useState } from "react";
import { Rocket } from "lucide-react";
import { ConnectWithUs } from "@/components/ConnectWithUs";
import { CookieNotice } from "@/components/CookieNotice";
import { FilterSection } from "@/components/FilterSection";
import { Footer } from "@/components/Footer";
import { JobList } from "@/components/JobList";
import { Navbar } from "@/components/Navbar";
import { PageViewsCounter } from "@/components/PageViewsCounter";
import { Pagination } from "@/components/Pagination";
import { PopularJobsAside } from "@/components/PopularJobsAside";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";
import type { JobFilterState } from "@/components/homeTypes";
import {
  getCategories,
  getCompanies,
  getJobs,
  getVisitorCount,
  registerVisitor,
} from "@/services/firebaseData";
import type { Category, Company, Job } from "@/types";

const ITEMS_PER_PAGE = 6;
const VISITOR_STORAGE_KEY = "seekjobs-visitor-registered";

const defaultFilters: JobFilterState = {
  search: "",
  categoryId: "",
  companyId: "",
  jobType: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
};

interface HomePageClientProps {
  initialJobs: Job[];
}

export function HomePageClient({ initialJobs }: HomePageClientProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [filters, setFilters] = useState<JobFilterState>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    const loadHomeData = async () => {
      setIsLoading(true);

      const [jobsData, categoryData, companyData] = await Promise.all([
        getJobs(),
        getCategories(),
        getCompanies(),
      ]);

      if (!alive) {
        return;
      }

      if (jobsData.length) {
        setJobs(jobsData);
      }

      setCategories(categoryData);
      setCompanies(companyData);
      setIsLoading(false);

      const currentVisitorCount = await getVisitorCount();

      if (!alive) {
        return;
      }

      if (typeof window !== "undefined") {
        const visitorRegistered = window.localStorage.getItem(VISITOR_STORAGE_KEY);

        if (!visitorRegistered) {
          const updatedCount = await registerVisitor();

          if (!alive) {
            return;
          }

          setVisitorCount(updatedCount || currentVisitorCount);
          window.localStorage.setItem(VISITOR_STORAGE_KEY, "1");
          return;
        }
      }

      setVisitorCount(currentVisitorCount);
    };

    void loadHomeData();

    return () => {
      alive = false;
    };
  }, []);

  const jobTypes = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.job_type).filter(Boolean) as string[])).sort(),
    [jobs],
  );

  const locations = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.location).filter(Boolean) as string[])).sort(),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const searchText = filters.search.trim().toLowerCase();
    const salaryMin = Number(filters.salaryMin || 0);
    const salaryMax = Number(filters.salaryMax || 0);

    return jobs.filter((job) => {
      const matchesSearch =
        !searchText ||
        job.title.toLowerCase().includes(searchText) ||
        (job.description || "").toLowerCase().includes(searchText) ||
        (job.company?.name || "").toLowerCase().includes(searchText) ||
        (job.location || "").toLowerCase().includes(searchText);

      const matchesCategory = !filters.categoryId || job.category_id === filters.categoryId;
      const matchesCompany = !filters.companyId || job.company_id === filters.companyId;
      const matchesType = !filters.jobType || job.job_type === filters.jobType;
      const matchesLocation = !filters.location || job.location === filters.location;

      const jobMin = typeof job.salary_min === "number" ? job.salary_min : 0;
      const jobMax = typeof job.salary_max === "number" ? job.salary_max : Number.MAX_SAFE_INTEGER;
      const matchesSalaryMin = salaryMin <= 0 || jobMax >= salaryMin;
      const matchesSalaryMax = salaryMax <= 0 || jobMin <= salaryMax;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCompany &&
        matchesType &&
        matchesLocation &&
        matchesSalaryMin &&
        matchesSalaryMax
      );
    });
  }, [filters, jobs]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedJobs = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredJobs.slice(start, end);
  }, [activePage, filteredJobs]);

  const popularJobs = useMemo(
    () =>
      [...jobs]
        .sort((a, b) => (b.applied_count ?? 0) - (a.applied_count ?? 0))
        .slice(0, 6),
    [jobs],
  );

  return (
    <>
      <Navbar totalJobs={jobs.length} />

      <main className="ui-shell flex w-full flex-col gap-6 py-6 sm:gap-8 sm:py-8 lg:py-10">
        <section className="ui-card ui-hero">
          <span className="ui-kicker">
            <Rocket className="h-3.5 w-3.5 text-primary" />
            Verified job board
          </span>
          <h1 className="ui-page-title mt-4">Find Your Next Career Move</h1>
          <p className="ui-page-intro mt-4">
            Discover verified jobs from leading Sri Lankan companies. Filter by company,
            category, salary, and location.
          </p>
        </section>

        <WhatsAppChannelBanner />

        <div id="jobs" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="space-y-5">
            <FilterSection
              categories={categories}
              companies={companies}
              jobTypes={jobTypes}
              locations={locations}
              value={filters}
              onChange={(nextFilters) => {
                setFilters(nextFilters);
                setCurrentPage(1);
              }}
              onReset={() => {
                setFilters(defaultFilters);
                setCurrentPage(1);
              }}
            />

            <JobList jobs={paginatedJobs} loading={isLoading} />

            <Pagination
              currentPage={activePage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (page < 1 || page > totalPages) {
                  return;
                }

                setCurrentPage(page);
              }}
            />
          </div>

          <div className="space-y-5 lg:sticky lg:top-28 lg:h-fit">
            <PopularJobsAside jobs={popularJobs} />
            <ConnectWithUs />
            <PageViewsCounter count={visitorCount} />
          </div>
        </div>
      </main>

      <Footer />
      <CookieNotice />
    </>
  );
}
