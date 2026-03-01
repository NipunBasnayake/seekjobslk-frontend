import { JobCard } from "@/components/JobCard";
import { JobCardSkeleton } from "@/components/JobCardSkeleton";
import type { Job } from "@/types";

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
}

export function JobList({ jobs, loading = false }: JobListProps) {
  if (loading) {
    return (
      <div className="grid gap-4">
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
          Try changing filters or search terms.
        </p>
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
