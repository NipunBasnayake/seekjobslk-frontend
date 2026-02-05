import Link from "next/link";
import type { Job } from "@/types";

interface PopularJobsAsideProps {
  jobs: Job[];
}

export function PopularJobsAside({ jobs }: PopularJobsAsideProps) {
  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-4 text-base font-semibold text-card-foreground">Popular Jobs</h3>
      <ul className="space-y-3">
        {jobs.slice(0, 6).map((job) => (
          <li key={job.id}>
            <Link
              href={`/job/${job.id}`}
              className="block rounded-xl border border-border p-3 transition hover:border-primary/40"
            >
              <p className="line-clamp-2 text-sm font-medium text-card-foreground">{job.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {job.company?.name || "Unknown Company"} - {job.applied_count ?? 0} applications
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
