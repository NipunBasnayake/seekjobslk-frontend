"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { ConnectWithUs } from "@/components/ConnectWithUs";
import { CookieNotice } from "@/components/CookieNotice";
import { FilterSection } from "@/components/FilterSection";
import { Footer } from "@/components/Footer";
import { JobList } from "@/components/JobList";
import { Navbar } from "@/components/Navbar";
import { Pagination } from "@/components/Pagination";
import { PopularJobsAside } from "@/components/PopularJobsAside";
import { VisitorCountCard } from "@/components/PageViewsCounter";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  
  console.log("🔵 [RENDER] HomePageClient render start");
  
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [filters, setFilters] = useState<JobFilterState>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);

  // URL is the single source of truth for pagination
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Math.max(1, pageFromUrl);
  console.log("🔵 [URL-SOURCE] pageFromUrl:", pageFromUrl, "currentPage:", currentPage);

  // Helper to update page in URL (only place that modifies URL)
  const navigateToPage = (page: number) => {
    console.log("🟢 [NAVIGATE] Navigating to page:", page);
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const newUrl = params.toString() ? `?${params.toString()}` : "/";
    console.log("🟢 [NAVIGATE] New URL:", newUrl);
    router.push(newUrl, { scroll: false });
  };

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

  const totalPages = filteredJobs.length === 0 ? 0 : Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  console.log("🔵 [CALC] totalPages:", totalPages, "filteredJobs.length:", filteredJobs.length, "pageSize:", ITEMS_PER_PAGE);
  
  // Clamp currentPage to valid range and auto-navigate if out of bounds
  const activePage = totalPages === 0 ? 1 : Math.min(Math.max(1, currentPage), totalPages);
  console.log("🔵 [CALC] activePage:", activePage, "currentPage:", currentPage, "totalPages:", totalPages);
  
  // Auto-navigate if page is out of bounds (but only if we're actually out of bounds)
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      console.log("⚠️ [AUTO-CLAMP] currentPage", currentPage, "> totalPages", totalPages, "- navigating to", totalPages);
      navigateToPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedJobs = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const sliced = filteredJobs.slice(start, end);
    console.log("🔵 [SLICE] activePage:", activePage, "start:", start, "end:", end, "sliced.length:", sliced.length, "first job:", sliced[0]?.title);
    return sliced;
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

      <main className="ui-shell flex w-full flex-col gap-8 py-6 sm:py-8 lg:gap-10 lg:py-10">
        <section className="ui-card ui-hero">
          <h1 className="ui-page-title mt-4">Find Your Next Career Move</h1>
          <p className="ui-page-intro mt-4">
            Discover verified jobs from leading Sri Lankan companies. Filter by company,
            category, salary, and location.
          </p>
        </section>

        <div id="jobs" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="space-y-6">
            <FilterSection
              categories={categories}
              companies={companies}
              jobTypes={jobTypes}
              locations={locations}
              value={filters}
              onChange={(nextFilters) => {
                console.log("🟡 [FILTER-CHANGE] Filters changed, resetting to page 1");
                setFilters(nextFilters);
                navigateToPage(1);
              }}
              onReset={() => {
                console.log("🟡 [FILTER-RESET] Filters reset, resetting to page 1");
                setFilters(defaultFilters);
                navigateToPage(1);
              }}
            />

            <JobList jobs={paginatedJobs} loading={isLoading} />

            <Pagination
              currentPage={activePage}
              totalPages={totalPages}
              totalItems={filteredJobs.length}
              pageSize={ITEMS_PER_PAGE}
              currentItemCount={paginatedJobs.length}
              onPageChange={(page) => {
                console.log("🟡 [PAGINATION-CLICK] Page change requested:", page, "totalPages:", totalPages);
                
                if (page < 1 || page > totalPages) {
                  console.log("⚠️ [PAGINATION-CLICK] Page out of range, ignoring");
                  return;
                }

                navigateToPage(page);
                
                // Scroll to jobs section
                const jobsSection = document.getElementById('jobs');
                if (jobsSection) {
                  jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />
          </div>

          <div className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <WhatsAppChannelBanner />
            <PopularJobsAside jobs={popularJobs} />
            <ConnectWithUs />
            <VisitorCountCard count={visitorCount} />
          </div>
        </div>
      </main>

      <Footer />
      <CookieNotice />
    </>
  );
}
