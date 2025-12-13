import React, { useMemo } from "react";
import { Briefcase, TrendingUp } from "lucide-react";
import type { Job } from "@/types";
import type { FilterState } from "./FilterSection";
import JobCard from "./JobCard";
import JobCardSkeleton from "./JobCardSkeleton";

interface JobListProps {
  filters: FilterState;
  jobs: Job[] | null;
}

const JobList: React.FC<JobListProps> = ({ filters, jobs }) => {
  const loading = jobs === null;
  const safeJobs = jobs ?? [];

  /* ---------------- Filtering ---------------- */
  const filteredJobs = useMemo(() => {
    return safeJobs.filter((job) => {
      if (
        filters.categories.length &&
        !filters.categories.includes(job.category.id)
      )
        return false;

      if (
        filters.companies.length &&
        !filters.companies.includes(job.company.id)
      )
        return false;

      if (
        filters.jobTypes.length &&
        !filters.jobTypes.includes(job.job_type)
      )
        return false;

      if (filters.location && filters.location !== "all") {
        if (job.job_type === "Remote" && filters.location !== "Remote")
          return false;
        if (job.job_type !== "Remote" && job.location !== filters.location)
          return false;
      }

      const salary = parseFloat(job.salary);
      if (!Number.isNaN(salary)) {
        if (
          salary < filters.salaryRange[0] ||
          salary > filters.salaryRange[1]
        )
          return false;
      }

      return true;
    });
  }, [safeJobs, filters]);

  /* ---------------- Sorting ---------------- */
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (
        b.posted_date.toDate().getTime() -
        a.posted_date.toDate().getTime()
      );
    });
  }, [filteredJobs]);

  const featuredCount = sortedJobs.filter((j) => j.is_featured).length;

  /* ---------------- Apply ---------------- */
  const handleApply = (jobId: string) => {
    const job = safeJobs.find((j) => j.id === jobId);
    if (job) job.applied_count += 1;
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Available Jobs</h2>
            <p className="text-sm text-muted-foreground">
              {sortedJobs.length} job
              {sortedJobs.length !== 1 && "s"} found
              {featuredCount > 0 && ` • ${featuredCount} featured`}
            </p>
          </div>
        </div>

        {featuredCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-accent">
            <TrendingUp className="h-4 w-4" />
            Hot jobs available
          </div>
        )}
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Jobs */}
      {!loading && sortedJobs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {sortedJobs.map((job, i) => (
            <div
              key={job.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <JobCard job={job} onApply={handleApply} />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && sortedJobs.length === 0 && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">No jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}
    </div>
  );
};

export default JobList;
