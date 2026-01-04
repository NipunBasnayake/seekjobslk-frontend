import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  Star,
  ExternalLink,
} from "lucide-react";
import type { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const location = useLocation();

  const logoSrc =
    job.company?.logo_url ||
    "https://ui-avatars.com/api/?name=Company&background=287194&color=fff&size=128";

  const appliedCount = Number(job.applied_count) || 0;
  const isNewJob = (() => {
    if (!job.posted_date) return false;
    const postedTime = job.posted_date.toDate().getTime();
    const now = Date.now();
    const diffInHours = (now - postedTime) / (1000 * 60 * 60);
    return diffInHours < 12;
  })();
  const is3WeeksOld = (() => {
    if (!job.posted_date) return false;
    const postedTime = job.posted_date.toDate().getTime();
    const now = Date.now();
    const diffInWeeks = (now - postedTime) / (1000 * 60 * 60 * 24 * 7);
    return diffInWeeks >= 3;
  })();

  const getTimeAgo = (date?: Date) => {
    if (!date) return "Date unavailable";
    const diff = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (diff <= 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  const hasFeatured = !!job.is_featured;

  return (
    <Link
      to={{
        pathname: `/job/${job.id}`,
        search: location.search,
      }}
      className="block"
    >
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
        {(hasFeatured || isNewJob || is3WeeksOld) && (
          <div className="absolute top-0 right-0 flex text-[11px] font-bold uppercase tracking-wide overflow-hidden">
            {isNewJob && (
              <div
                className={`bg-emerald-500 text-white px-3 py-1 ${hasFeatured ? "rounded-bl-2xl" : "rounded-tr-2xl rounded-bl-2xl"
                  }`}
              >
                New
              </div>
            )}

            {is3WeeksOld && (
              <div
                className={`bg-orange-400 text-white px-3 py-1 ${hasFeatured ? "rounded-bl-2xl" : "rounded-tr-2xl rounded-bl-2xl"
                  }`}
              >
                Posted 3 weeks ago
              </div>
            )}

            {hasFeatured && (
              <div
                className={`bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1 ${isNewJob ? "rounded-tr-2xl" : "rounded-tr-2xl rounded-bl-2xl"
                  }`}
              >
                <Star className="h-3 w-3 fill-current" />
                Featured
              </div>
            )}
          </div>
        )}

        <div className="flex items-start gap-4">
          <img
            src={logoSrc}
            alt={job.company?.name || "Company Logo"}
            className="h-16 w-16 rounded-xl border object-cover transition-transform group-hover:scale-105"
          />

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {job.title || "Untitled Position"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {job.company?.name || "Company"}
            </p>
          </div>
        </div>

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

          <div className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {getTimeAgo(job.posted_date?.toDate())}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {appliedCount} applied
          </div>

          <Button
            variant="apply"
            size="sm"
            className="gap-1.5"
            onClick={() => onApply(job.id)}
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
