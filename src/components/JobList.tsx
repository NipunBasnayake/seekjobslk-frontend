import React, { useState, useEffect, useMemo } from "react";
import { Briefcase, TrendingUp } from "lucide-react";
import { Job } from "@/types/index";
import { FilterState } from "./FilterSection";
import JobCard from "./JobCard";

interface JobListProps {
  filters: FilterState;
  jobs: Job[] | null;
}

const JobList: React.FC<JobListProps> = ({ filters, jobs: parentJobs }) => {
  const safeJobs = parentJobs ?? []; // prevents null crashes

  const [jobs, setJobs] = useState<Job[]>(safeJobs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // console.log("🔥 Parent jobs received:", parentJobs);

    setJobs(parentJobs ?? []); // ensure array
    setLoading(false);
  }, [parentJobs]);


  // Filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(job.category.id)
      ) {
        return false;
      }

      // Company filter
      if (
        filters.companies.length > 0 &&
        !filters.companies.includes(job.company.id)
      ) {
        return false;
      }

      // Job type filter
      if (
        filters.jobTypes.length > 0 &&
        !filters.jobTypes.includes(job.job_type)
      ) {
        return false;
      }

      // Location filter
      if (filters.location && filters.location !== "all") {
        if (job.job_type === "Remote" && filters.location !== "Remote") {
          return false;
        }
        if (job.job_type !== "Remote" && job.location !== filters.location) {
          return false;
        }
      }

      // Salary filter
      const salaryValue = parseFloat(job.salary);
      if (
        salaryValue < filters.salaryRange[0] ||
        salaryValue > filters.salaryRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [jobs, filters]);

  // Sorting
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;

    const dateA = a.posted_date.toDate();
    const dateB = b.posted_date.toDate();

    return dateB.getTime() - dateA.getTime();
  });

  const featuredCount = sortedJobs.filter((j) => j.is_featured).length;

  // Apply handler
  const handleApply = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, applied_count: job.applied_count + 1 }
          : job
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-heading">Available Jobs</h2>
            <p className="text-sm text-muted-foreground">
              {sortedJobs.length} job
              {sortedJobs.length !== 1 ? "s" : ""} found
              {featuredCount > 0 && ` • ${featuredCount} featured`}
            </p>
          </div>
        </div>
        {featuredCount > 0 && (
          <div className="flex items-center gap-1.5 text-accent text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            Hot jobs available
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-16 text-red-500">{error}</div>
      )}

      {/* Job Grid */}
      {!loading && !error && sortedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortedJobs.map((job, index) => (
            <div
              key={job.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <JobCard job={job} onApply={handleApply} />
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-heading mb-2">
              No jobs found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more results
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default JobList;
