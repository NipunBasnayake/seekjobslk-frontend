import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Users, Star, ExternalLink } from "lucide-react";
import type { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const logoSrc =
    job.company?.logo_url ||
    "https://ui-avatars.com/api/?name=Company&background=287194&color=fff&size=128";

  const appliedCount = Number(job.applied_count) || 0;

  const getTimeAgo = (date?: Date) => {
    if (!date) return "Date unavailable";
    const diff = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (diff <= 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  return (
    <Link to={`/job/${job.id}`} className="block">
      <article
        className="
          relative group
          bg-card border border-border
          rounded-2xl
          p-6 md:p-7
          shadow-card
          hover:shadow-card-hover
          transition-all duration-300
          hover:-translate-y-1
          max-w-[520px] w-full
        "
      >
        {/* Featured */}
        {job.is_featured && (
          <div className="absolute top-0 right-0 rounded-bl-2xl rounded-tr-2xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-4">
          <img
            src={logoSrc}
            alt={job.company?.name}
            className="h-16 w-16 rounded-xl border object-cover transition-transform group-hover:scale-105"
          />

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {job.title || "Untitled Position"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {job.company?.name}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {!job.job_type?.toLowerCase().includes("remote") && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              {job.location || "Sri Lanka"}
            </span>
          )}

          <Badge variant="secondary" className="font-medium">
            {job.job_type || "Job Type"}
          </Badge>
        </div>

        {/* Posted */}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {getTimeAgo(job.posted_date?.toDate())}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {appliedCount} applied
          </div>

          <Button
            variant="apply"
            size="sm"
            className="gap-1.5"
          >
            Apply
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </article>
    </Link>
  );
};

export default JobCard;
