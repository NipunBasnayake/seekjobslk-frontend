import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Star, ExternalLink } from 'lucide-react';
import type { Job } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
const displaySalary = job.salary || "Salary not disclosed";


  const getTimeAgo = (date?: Date) => {
    if (!date) {
      return 'Date unavailable';
    }
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (job.id) {
      onApply(job.id);
    }
    if (job.apply_url && job.apply_url !== '#') {
      window.open(job.apply_url, '_blank');
    }
  };

  const logoSrc = job.company?.logo_url || 'https://ui-avatars.com/api/?name=Company&background=287194&color=fff&size=128';
  const companyName = job.company?.name;
  const jobTitle = job.title || 'Untitled Position';
  const jobType = job.job_type || 'Job type unknown';
  const jobLocation = job.location || 'Sri Lanka';
  const description = job.description || 'No description provided.';
  const appliedCount = Number.isFinite(job.applied_count) ? job.applied_count : 0;

  return (
    <Link to={`/job/${job.id}`}>
      <article className="group bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        {/* Featured Badge */}
        {job.is_featured && (
          <div className="absolute top-0 right-0">
            <div className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          </div>
        )}

        {/* Company Logo & Info */}
        <div className="flex items-start gap-4">
          <img
            src={logoSrc}
            alt={companyName}
            className="w-14 h-14 rounded-xl object-cover border border-border group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-heading group-hover:text-primary transition-colors line-clamp-1">
              {jobTitle}
            </h3>
            <p className="text-muted-foreground text-sm mt-0.5">{companyName}</p>
          </div>
        </div>

        {/* Job Details */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            {jobLocation}
          </span>

          <Badge variant="secondary" className="font-medium">
            {jobType}
          </Badge>
        </div>

        {/* Posted At */}
        <div className="mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {getTimeAgo(job.posted_date?.toDate())}
          </span>
        </div>

        {/* Salary */}
        <div className="mt-3">
          <p className="text-heading font-semibold">
            {job.salary || "Salary not disclosed"}
          </p>

        </div>

        {/* Description */}
        <p className="mt-3 text-text text-sm line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{appliedCount} applied</span>
          </div>
          <Button
            variant="apply"
            size="sm"
            className="gap-1.5"
            onClick={handleApplyClick}
          >
            Apply Now
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </article>
    </Link>
  );
};

export default JobCard;
