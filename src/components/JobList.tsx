import React, { useMemo, useState, useEffect } from "react";
import { Briefcase, Search } from "lucide-react";
import type { Job } from "@/types";
import type { FilterState } from "./FilterSection";
import JobCard from "./JobCard";
import JobCardSkeleton from "./JobCardSkeleton";
import Pagination from "./Pagination";

interface JobListProps {
  filters: FilterState;
  jobs: Job[] | null;
}

const JOBS_PER_PAGE = 10;

const JobList: React.FC<JobListProps> = ({ filters, jobs }) => {
  const loading = jobs === null;
  const safeJobs = jobs ?? [];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const jobMatchesSearch = (job: Job, query: string): boolean => {
    if (!query.trim()) return true;

    const normalizedQuery = query.toLowerCase();

    const flattenObject = (obj: any): string[] => {
      return Object.values(obj).flatMap((value) => {
        if (!value) return [];
        if (typeof value === "string" || typeof value === "number") {
          return [String(value)];
        }
        if (Array.isArray(value)) {
          return value.map(String);
        }
        if (typeof value === "object") {
          return flattenObject(value);
        }
        return [];
      });
    };

    return flattenObject(job)
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  };

  const filteredJobs = useMemo(() => {
    return safeJobs.filter((job) => {
      if (filters.categories.length && !filters.categories.includes(job.category.id)) return false;
      if (filters.companies.length && !filters.companies.includes(job.company.id)) return false;
      if (filters.jobTypes.length && !filters.jobTypes.includes(job.job_type)) return false;

      if (filters.location && filters.location !== "all") {
        if (job.job_type === "Remote" && filters.location !== "Remote") return false;
        if (job.job_type !== "Remote" && job.location !== filters.location) return false;
      }

      const salary = parseFloat(job.salary);
      if (!Number.isNaN(salary)) {
        if (salary < filters.salaryRange[0] || salary > filters.salaryRange[1]) return false;
      }

      if (!jobMatchesSearch(job, searchQuery)) return false;

      return true;
    });
  }, [safeJobs, filters, searchQuery]);

  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return b.posted_date.toDate().getTime() - a.posted_date.toDate().getTime();
    });
  }, [filteredJobs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return sortedJobs.slice(start, start + JOBS_PER_PAGE);
  }, [sortedJobs, currentPage]);

  const featuredCount = sortedJobs.filter((j) => j.is_featured).length;

  const handleApply = (jobId: string) => {
    const job = safeJobs.find((j) => j.id === jobId);
    if (job) job.applied_count += 1;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Available Jobs</h2>
            <p className="text-sm text-muted-foreground">
              {sortedJobs.length} jobs found
              {featuredCount > 0 && ` • ${featuredCount} featured`}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
                  w-full rounded-lg border
                  bg-background
                  py-3 pl-11 pr-4 text-sm
                  text-foreground
                  placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary
                  dark:border-border
                "
          />
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && paginatedJobs.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
            {paginatedJobs.map((job, i) => (
              <div
                key={job.id}
                className="animate-fade-in w-full"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <JobCard job={job} onApply={handleApply} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {!loading && sortedJobs.length === 0 && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">No jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting filters or search keywords
          </p>
        </div>
      )}
    </div>
  );
};

export default JobList;
