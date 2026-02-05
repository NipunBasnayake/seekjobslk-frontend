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
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-card">
        <h3 className="text-lg font-semibold text-card-foreground">No jobs found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try changing filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
