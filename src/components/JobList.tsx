"use client";

import React, { useMemo, useState, useEffect } from "react";
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
        if (Array.isArray(value)) return value.map(String);
        if (typeof value === "object") return flattenObject(value);
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

  return (
    <div className="space-y-6">
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && paginatedJobs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
          {paginatedJobs.map((job, i) => (
            <JobCard key={job.id} job={job} onApply={() => {}} />
          ))}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {!loading && sortedJobs.length === 0 && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <h3 className="mb-1 text-lg font-semibold">No jobs found</h3>
          <p className="text-muted-foreground">Try adjusting filters or search keywords</p>
        </div>
      )}
    </div>
  );
};

export default JobList;
