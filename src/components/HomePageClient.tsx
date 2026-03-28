"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BriefcaseBusiness, Building2, ShieldCheck, Star, Users } from "lucide-react";
import { ConnectWithUs } from "@/components/ConnectWithUs";
import { CookieNotice } from "@/components/CookieNotice";
import { FilterSection } from "@/components/FilterSection";
import { Footer } from "@/components/Footer";
import { JobList } from "@/components/JobList";
import { AdSlotPlaceholder } from "@/components/AdSlotPlaceholder";
import { Navbar } from "@/components/Navbar";
import { Pagination } from "@/components/Pagination";
import { PopularJobsAside } from "@/components/PopularJobsAside";
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
  // const [visitorCount, setVisitorCount] = useState(0);
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


  // Calculate total job applies
  const totalJobApplies = useMemo(() => {
    return jobs.reduce((sum, job) => sum + (job.applied_count ?? 0), 0);
  }, [jobs]);

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
  const featuredJobsCount = useMemo(
    () => jobs.filter((job) => job.is_featured === true).length,
    [jobs],
  );

  return (
    <>
      <Navbar totalJobs={jobs.length} />

      <main className="ui-shell flex w-full flex-col gap-8 py-6 sm:py-8 lg:gap-10 lg:py-10">
        <header className="ui-hero">
          <div className="ui-hero-content">
            <h1 className="ui-page-title mt-4">Find a high-quality job, faster</h1>

            <p className="ui-page-intro mt-4">
              Browse active openings from verified hiring channels. Filter by title, company,
              category, job type, location, and salary to find your next role with confidence.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <article className="ui-hero-stat">
                <div className="ui-hero-stat-icon">
                  <BriefcaseBusiness className="h-7 w-7" aria-hidden="true" />
                </div>
                <div className="ui-hero-stat-content">
                  <p className="ui-hero-stat-label">Active jobs</p>
                  <p className="ui-hero-stat-value">{jobs.length}</p>
                </div>
              </article>

              <article className="ui-hero-stat">
                <div className="ui-hero-stat-icon">
                  <Building2 className="h-7 w-7" aria-hidden="true" />
                </div>
                <div className="ui-hero-stat-content">
                  <p className="ui-hero-stat-label">Hiring companies</p>
                  <p className="ui-hero-stat-value">{initialCompanies.length}</p>
                </div>
              </article>

              <article className="ui-hero-stat">
                <div className="ui-hero-stat-icon">
                  <Users className="h-7 w-7" aria-hidden="true" />
                </div>
                <div className="ui-hero-stat-content">
                  <p className="ui-hero-stat-label">Job categories</p>
                  <p className="ui-hero-stat-value">{initialCategories.length}</p>
                </div>
              </article>

              <article className="ui-hero-stat">
                <div className="ui-hero-stat-icon">
                  <Star className="h-7 w-7" aria-hidden="true" />
                </div>
                <div className="ui-hero-stat-content">
                  <p className="ui-hero-stat-label">Total applications</p>
                  <p className="ui-hero-stat-value">
                    {totalJobApplies > 0 ? totalJobApplies.toLocaleString() : "--"}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </header>

        <section
          id="jobs"
          aria-labelledby="jobs-section-title"
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
        >
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

            <section
              className="rounded-2xl border border-border/75 bg-card p-4 sm:p-5"
              aria-live="polite"
            >
              <p className="text-sm text-muted-foreground">
                {hasNoResults
                  ? "No jobs match your current filters."
                  : `Showing ${paginatedJobs.length} of ${filteredJobs.length} matching jobs`}
              </p>
            </section>

            <JobList
              jobs={paginatedJobs}
              onResetFilters={() => {
                setFilters(defaultFilters);
                navigateToPage(1);
              }}
            />

            {!hasNoResults ? (
              <AdSlotPlaceholder label="In-feed ad space" className="min-h-28" />
            ) : null}

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

          <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <AdSlotPlaceholder
              label="Sidebar ad space (300 x 250)"
              className="min-h-[260px]"
            />

            <section className="ui-card p-5">
              <h2 className="ui-card-title">Why job seekers trust SeekJobsLk</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Verified application channels
                </li>
                <li className="flex items-start gap-2.5">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Employer-focused local opportunities
                </li>
                <li className="flex items-start gap-2.5">
                  <BriefcaseBusiness
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  Transparent role details and salary context
                </li>
                <li className="flex items-start gap-2.5">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Human-first browsing experience
                </li>
              </ul>
              <p className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                Built for clarity, trust, and speed.
              </p>
            </section>

            <WhatsAppChannelBanner />
            <PopularJobsAside jobs={popularJobs} />
            <ConnectWithUs />
          </aside>
        </section>
      </main>

      <Footer />
      <CookieNotice />
    </>
  );
}
