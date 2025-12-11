import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Briefcase, 
  DollarSign, 
  Building2,
  ExternalLink,
  Share2,
  Star,
  CheckCircle2
} from 'lucide-react';
import { jobs } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [appliedCount, setAppliedCount] = useState(0);
  
  const job = useMemo(() => jobs.find(j => j.id === jobId), [jobId]);

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-heading mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} per month`;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Posted today';
    if (diffDays === 1) return 'Posted yesterday';
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffDays / 30)} months ago`;
  };

  const handleApply = () => {
    setAppliedCount(prev => prev + 1);
    window.open(job.applyUrl, '_blank');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job.title} at ${job.company.name}`,
          text: job.shortDescription,
          url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'Job link has been copied to clipboard',
      });
    }
  };

  const currentAppliedCount = job.appliedCount + appliedCount;

  return (
    <>
      <Helmet>
        <title>{job.title} at {job.company.name} | SeekJobsLk</title>
        <meta name="description" content={job.shortDescription} />
        <meta property="og:title" content={`${job.title} at ${job.company.name}`} />
        <meta property="og:description" content={job.shortDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://seekjobslk.com/job/${job.id}`} />
      </Helmet>

      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navbar />

        <main className="container mx-auto px-4 py-6 md:py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <article className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-card relative overflow-hidden">
                {job.isFeatured && (
                  <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-semibold px-4 py-1.5 rounded-bl-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Featured Job
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-5">
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-20 h-20 rounded-xl object-cover border border-border"
                  />
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-heading mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{job.company.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        {job.location}
                      </span>
                      <Badge variant="secondary">{job.jobType}</Badge>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {getTimeAgo(job.postedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <section className="bg-card rounded-xl border border-border p-6 shadow-card">
                <h2 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Job Description
                </h2>
                <p className="text-text leading-relaxed whitespace-pre-line">
                  {job.fullDescription}
                </p>
              </section>

              {/* Requirements */}
              <section className="bg-card rounded-xl border border-border p-6 shadow-card">
                <h2 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-text">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </article>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Apply Card */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-card sticky top-24">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <DollarSign className="w-4 h-4" />
                    Salary
                  </div>
                  <p className="text-xl font-bold text-heading">
                    {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
                  <Users className="w-4 h-4" />
                  <span>{currentAppliedCount} people have applied</span>
                </div>

                <div className="space-y-3">
                  <Button 
                    variant="apply" 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={handleApply}
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                    Share Job
                  </Button>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-card">
                <h3 className="font-semibold text-heading mb-4">About the Company</h3>
                <div className="flex items-center gap-3">
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-12 h-12 rounded-lg object-cover border border-border"
                  />
                  <div>
                    <p className="font-medium text-heading">{job.company.name}</p>
                    <p className="text-sm text-muted-foreground">Sri Lanka</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default JobDetails;
