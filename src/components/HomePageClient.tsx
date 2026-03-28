"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, Sparkles } from "lucide-react";
import { ConnectWithUs } from "@/components/ConnectWithUs";
import { CookieNotice } from "@/components/CookieNotice";
import { FilterSection } from "@/components/FilterSection";
import { Footer } from "@/components/Footer";
import { JobList } from "@/components/JobList";
import { AdSlotPlaceholder } from "@/components/AdSlotPlaceholder";
import { Navbar } from "@/components/Navbar";
import { Pagination } from "@/components/Pagination";
import { PopularJobsAside } from "@/components/PopularJobsAside";
import { VisitorCountCard } from "@/components/PageViewsCounter";
import type { JobFilterState } from "@/components/homeTypes";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";
import { filterAndSortJobs } from "@/lib/jobFiltering";
import { getVisitorCount, registerVisitor } from "@/services/firebaseData";
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
  sortBy: "newest",
};

interface HomePageClientProps {
  initialJobs: Job[];
  initialCategories: Category[];
  initialCompanies: Company[];
}

export function HomePageClient({
  initialJobs,
  initialCategories,
  initialCompanies,
}: HomePageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs] = useState<Job[]>(initialJobs);
  const [visitorCount, setVisitorCount] = useState(0);
  const [filters, setFilters] = useState<JobFilterState>(defaultFilters);

  const pageFromUrl = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Math.max(1, pageFromUrl);

  const navigateToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }

      const nextUrl = params.toString() ? `?${params.toString()}` : "/";
      router.push(nextUrl, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    let alive = true;

    const loadVisitorCount = async () => {
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

    void loadVisitorCount();

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
    return filterAndSortJobs(jobs, filters);
  }, [filters, jobs]);

  const totalPages = filteredJobs.length ? Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) : 0;
  const activePage = totalPages === 0 ? 1 : Math.min(Math.max(1, currentPage), totalPages);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      navigateToPage(totalPages);
    }
  }, [currentPage, navigateToPage, totalPages]);

  const paginatedJobs = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [activePage, filteredJobs]);

  const popularJobs = useMemo(
    () =>
      [...jobs]
        .sort((a, b) => (b.applied_count ?? 0) - (a.applied_count ?? 0))
        .slice(0, 6),
    [jobs],
  );

  const hasNoResults = filteredJobs.length === 0;

  return (
    <>
      <Navbar totalJobs={jobs.length} />

      <main className="ui-shell flex w-full flex-col gap-8 py-6 sm:py-8 lg:gap-10 lg:py-10">
        {/* Hero Section */}
        <section className="ui-card ui-hero overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="ui-kicker">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Sri Lanka&apos;s Job Portal
            </span>
          </div>

          <h1 className="ui-page-title mt-4">
            Find Your Next Career Move
          </h1>

          <p className="ui-page-intro mt-4">
            Discover verified jobs from leading Sri Lankan companies. Search by title, company,
            category, location, and salary.
          </p>

          {/* Quick stats */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
              <span>{jobs.length} Active Jobs</span>
            </div>
          </div>
        </section>

        <div id="jobs" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="space-y-6">
            <FilterSection
              categories={initialCategories}
              companies={initialCompanies}
              jobTypes={jobTypes}
              locations={locations}
              value={filters}
              onChange={(nextFilters) => {
                setFilters(nextFilters);
                navigateToPage(1);
              }}
              onReset={() => {
                setFilters(defaultFilters);
                navigateToPage(1);
              }}
            />

            {/* Results summary */}
            <section
              className="rounded-xl border border-border/50 bg-surface-tinted px-4 py-3"
              aria-live="polite"
            >
              <p className="text-sm text-muted-foreground">
                {hasNoResults ? (
                  "No jobs match your current filters."
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-card-foreground">
                      {paginatedJobs.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-card-foreground">
                      {filteredJobs.length}
                    </span>{" "}
                    matching jobs
                  </>
                )}
              </p>
            </section>

            <JobList
              jobs={paginatedJobs}
              onResetFilters={() => {
                setFilters(defaultFilters);
                navigateToPage(1);
              }}
            />

            <Pagination
              currentPage={activePage}
              totalPages={totalPages}
              totalItems={filteredJobs.length}
              pageSize={ITEMS_PER_PAGE}
              currentItemCount={paginatedJobs.length}
              onPageChange={(page) => {
                if (page < 1 || page > totalPages) {
                  return;
                }

                navigateToPage(page);
                const jobsSection = document.getElementById("jobs");
                jobsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <AdSlotPlaceholder label="Advertisement" />
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
