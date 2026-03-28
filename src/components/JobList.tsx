import { Briefcase, SearchX } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { JobCardSkeleton } from "@/components/JobCardSkeleton";
import type { Job } from "@/types";

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  onResetFilters?: () => void;
}

export function JobList({ jobs, loading = false, onResetFilters }: JobListProps) {
  if (loading) {
    return (
      <div className="grid gap-5" role="status" aria-label="Loading jobs">
        {Array.from({ length: 6 }).map((_, index) => (
          <JobCardSkeleton key={index} />
        ))}
        <span className="sr-only">Loading job listings...</span>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="ui-card ui-card-tinted flex flex-col items-center border-dashed px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <SearchX className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>

        <h3 className="mt-6 text-xl font-semibold tracking-tight text-card-foreground">
          No jobs match your filters
        </h3>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          We couldn&apos;t find any jobs matching your current search criteria. Try adjusting your
          filters or search terms to discover more opportunities.
        </p>

        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="ui-button ui-button-primary mt-6"
          >
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            Clear All Filters
          </button>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          New jobs are added daily. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5" role="feed" aria-label="Job listings">
      {jobs.map((job, index) => (
        <JobCard key={job.id} job={job} priority={index < 3} />
      ))}
    </div>
  );
}
