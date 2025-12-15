import { Flame, Users, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "@/types";

interface Props {
    jobs: Job[] | null;
}

export default function PopularJobsAside({ jobs }: Props) {
    if (!jobs || jobs.length === 0) return null;

    const popularJobs = [...jobs]
        .filter(job => typeof job.applied_count === "number")
        .sort((a, b) => (b.applied_count ?? 0) - (a.applied_count ?? 0))
        .slice(0, 7);

    if (popularJobs.length === 0) return null;

    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            {/* Header */}
            <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="text-md font-semibold">Popular Jobs</h3>
            </div>

            <ul className="divide-y divide-border/60">
                {popularJobs.map(job => (
                    <li key={job.id}>
                        <Link
                            to={`/job/${job.id}`}
                            className="flex gap-3 px-2 py-3 transition-colors hover:bg-muted/50"
                        >
                            {/* Company Logo */}
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

                            {/* Job Info */}
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
