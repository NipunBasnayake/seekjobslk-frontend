import Link from "next/link";
import type { Job } from "@/types";

interface PopularJobsAsideProps {
  jobs: Job[];
}

export function PopularJobsAside({ jobs }: PopularJobsAsideProps) {
  return (
    <aside className="ui-card p-5 sm:p-6">
      <h3 className="ui-card-title">Popular Jobs</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Roles with the highest recent application activity.
      </p>
      <ul className="ui-zebra mt-4 space-y-2.5">
        {jobs.slice(0, 6).map((job) => (
          <li key={job.id}>
            <Link
              href={`/job/${job.id}`}
              className="ui-list-item hover:border-primary/40"
            >
              <p className="line-clamp-2 text-sm font-medium text-card-foreground">{job.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {job.company?.name || "Unknown Company"} - {job.applied_count ?? 0} applications
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
