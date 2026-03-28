import Link from "next/link";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getCompanyInitials, getCompanyName } from "@/lib/jobPresentation";
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
        {jobs.slice(0, 6).map((job) => {
          const companyName = getCompanyName(job);
          const initials = getCompanyInitials(companyName);

          return (
            <li key={job.id}>
              <Link href={`/job/${job.id}`} className="ui-list-item group hover:border-primary/40">
                <div className="flex items-start gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border bg-muted/30">
                    <OptimizedImage
                      src={job.company?.logo_url}
                      fallbackSrc="/globe.svg"
                      fallbackContent={
                        <div className="absolute inset-0 grid place-items-center bg-primary/10 text-xs font-bold text-primary">
                          {initials}
                        </div>
                      }
                      alt={`${companyName} logo`}
                      width={56}
                      height={56}
                      className="h-full w-full transition duration-300 group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-card-foreground">
                      {job.title}
                    </p>
                    <p className="mt-1 truncate text-xs font-medium uppercase tracking-[0.03em] text-muted-foreground">
                      {companyName}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {job.applied_count ?? 0} applications
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
