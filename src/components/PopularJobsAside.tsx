import Link from "next/link";
import type { Job } from "@/types";

interface PopularJobsAsideProps {
  jobs: Job[];
}

function getInitials(name?: string) {
  if (!name) return "UC";
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (!parts.length) return "UC";
  return parts.map((p) => p[0]?.toUpperCase()).join("");
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
          const companyName = job.company?.name || "Unknown Company";
          const initials = getInitials(companyName);
          const logoUrl = job.company?.logo_url || null;

          return (
            <li key={job.id}>
              <Link
                href={`/job/${job.id}`}
                className="ui-list-item group hover:border-primary/40"
              >
                <div className="flex items-start gap-3">
                  {/* Logo */}
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border bg-muted/30">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`${companyName} logo`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Hide broken image and show fallback
                          e.currentTarget.style.display = "none";
                          const fallback =
                            e.currentTarget.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = "grid";
                        }}
                      />
                    ) : null}

                    {/* Fallback initials */}
                    <div
                      style={{ display: logoUrl ? "none" : "grid" }}
                      className="absolute inset-0 place-items-center bg-primary/10 text-xs font-bold text-primary"
                      aria-label={`${companyName} initials`}
                    >
                      {initials}
                    </div>

                    {/* subtle overlay + ring glow on hover */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-black/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-card-foreground">
                      {job.title}
                    </p>
                    <p className="mt-1 truncate text-xs font-medium uppercase tracking-[0.03em] text-muted-foreground">
                      {companyName}
                    </p>
                    {/* <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {job.applied_count ?? 0} applications
                    </p> */}
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