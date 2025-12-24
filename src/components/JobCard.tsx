"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Star, ExternalLink } from "lucide-react";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const logoSrc =
    job.company?.logo_url ||
    "https://ui-avatars.com/api/?name=Company&background=287194&color=fff&size=128";

  const appliedCount = Number(job.applied_count) || 0;

  const isNewJob = (() => {
    if (!job.posted_date) return false;
    const diffInHours = (Date.now() - job.posted_date.toDate().getTime()) / (1000 * 60 * 60);
    return diffInHours < 12;
  })();

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <article className="relative group bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        {(isNewJob || job.is_featured) && (
          <div className="absolute top-0 right-0 flex text-[11px] font-bold uppercase tracking-wide">
            {isNewJob && <div className="bg-emerald-500 text-white px-3 py-1 rounded-bl-2xl">New</div>}
            {job.is_featured && (
              <div className="bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1 rounded-tr-2xl">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </div>
            )}
          </div>
        )}

        <div className="flex items-start gap-4">
          <img src={logoSrc} alt={job.company?.name} className="h-16 w-16 rounded-xl border object-cover" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold leading-tight line-clamp-1">{job.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{job.company?.name}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {job.job_type?.toLowerCase() !== "remote" && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" /> {job.location}
            </span>
          )}
          <Badge variant="secondary" className="font-medium">{job.job_type}</Badge>
          <div className="ml-auto flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {job.posted_date ? `${Math.floor((Date.now() - job.posted_date.toDate().getTime()) / 86400000)} days ago` : "N/A"}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {appliedCount} applied
          </div>
          <Button variant="apply" size="sm" className="gap-1.5" onClick={() => onApply(job.id)}>
            Apply <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </article>
    </Link>
  );
};

export default JobCard;
