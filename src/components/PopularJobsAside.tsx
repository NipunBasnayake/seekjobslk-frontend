import { Flame, Users, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "@/types";
import { OptimizedImage } from "@/components/OptimizedImage";

interface Props {
    jobs: Job[] | null;
}

const POPULAR_JOB_DAYS = 14;

export default function PopularJobsAside({ jobs }: Props) {
    if (!jobs || jobs.length === 0) return null;

    const now = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - POPULAR_JOB_DAYS);

    const popularJobs = [...jobs]
        .filter(job => {
            if (typeof job.applied_count !== "number") return false;
            if (!job.posted_date) return false;

            const jobDate = new Date(job.posted_date.toDate());
            return jobDate >= cutoffDate;
        })
        .sort((a, b) => (b.applied_count ?? 0) - (a.applied_count ?? 0))
        .slice(0, 7);

    if (popularJobs.length === 0) return null;

    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                    <h3 className="text-md font-semibold">Popular Jobs</h3>
                    <p className="text-xs text-muted-foreground">
                        Last {POPULAR_JOB_DAYS} days
                    </p>
                </div>
            </div>

            <ul className="divide-y divide-border/60">
                {popularJobs.map(job => (
                    <li key={job.id}>
                        <Link
                            to={`/job/${job.id}`}
                            className="flex gap-3 px-2 py-3 transition-colors hover:bg-muted/50"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                                {job.company?.logo_url ? (
                                    <OptimizedImage
                                        src={job.company.logo_url}
                                        alt={job.company.name || "Company logo"}
                                        width={32}
                                        height={32}
                                        lazy={true}
                                        skeleton={false}
                                        className="h-8 w-8 rounded-sm object-contain"
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
                                        {job.applied_count}
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
