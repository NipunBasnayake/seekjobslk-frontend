import { Layers, Users, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "@/types";

interface Props {
  jobs: Job[] | null;
  currentJob: Job;
  limit?: number;
}

const RELATED_JOB_DAYS = 14;

export default function RelatedJobsAside({
  jobs,
  currentJob,
  limit = 6,
}: Props) {
  if (!jobs || jobs.length === 0) return null;

  const currentCategory =
    currentJob.category.name ||
    currentJob.category.id ||
    currentJob.job_type;

  if (!currentCategory) return null;

  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - RELATED_JOB_DAYS);

  const relatedJobs = jobs
    .filter(job => {
      const jobCategory =
        job.category.name ||
        job.category.id ||
        job.job_type;

      const jobPostedDate = job.posted_date.toDate();
      const isRecent = jobPostedDate >= threeWeeksAgo;

      return (
        job.id !== currentJob.id &&
        jobCategory === currentCategory &&
        isRecent
      );
    })
    .sort((a, b) => (b.applied_count ?? 0) - (a.applied_count ?? 0))
    .slice(0, limit);

  if (relatedJobs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Layers className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-md font-semibold">Related Jobs</h3>
          <p className="text-xs text-muted-foreground">Posted within 14 days</p>
        </div>
      </div>

      <ul className="divide-y divide-border/60">
        {relatedJobs.map(job => (
          <li key={job.id}>
            <Link
              to={`/job/${job.id}`}
              className="flex gap-3 px-2 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                {job.company?.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    alt={job.company.name || "Company logo"}
                    className="h-8 w-8 rounded-sm object-contain"
                    loading="lazy"
                  />
                ) : (
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug line-clamp-2">
                  {job.title}
                </p>

                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="line-clamp-1">
                    {job.company?.name || "Company"}
                  </span>

                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.applied_count ?? 0}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
