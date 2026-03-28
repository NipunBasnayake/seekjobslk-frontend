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
      <div className="grid gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <JobCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="ui-card border-dashed p-10 text-center">
        <h3 className="ui-section-title">No jobs found</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Try changing filters or search terms to discover matching jobs.
        </p>
        {onResetFilters ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="ui-button ui-button-secondary mx-auto mt-5"
          >
            Reset Filters
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
