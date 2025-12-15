import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
    CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import JobDetailsSkeleton from "@/components/JobDetailsSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getJobById, getJobs, incrementJobAppliedCount } from "@/services/firebaseData";
import type { Job } from "@/types";
import ConnectWithUs from "@/components/ConnectWithUs";
import PageViewsCounter from "@/components/PageViewsCounter";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";
import RelatedJobsAside from "@/components/RelatedJobsAside";

const APPLY_DELAY = 5;

const JobDetails: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applyCountdown, setApplyCountdown] = useState(APPLY_DELAY);
    const [localApplied, setLocalApplied] = useState(0);
    const [allJobs, setAllJobs] = useState<Job[] | null>(null);

    useEffect(() => {
        if (!jobId) return;

        let mounted = true;

        const load = async () => {
            setLoading(true);
            const data = await getJobById(jobId);
            if (mounted) {
                setJob(data);
                setLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, [jobId]);

    useEffect(() => {
        if (loading) return;

        setApplyCountdown(APPLY_DELAY);
        const timer = setInterval(() => {
            setApplyCountdown((v) => {
                if (v <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return v - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading]);

    useEffect(() => {
        getJobs().then(setAllJobs).catch(() => setAllJobs(null));
    }, []);

    const appliedCount = useMemo(
        () => (job?.applied_count ?? 0) + localApplied,
        [job, localApplied]
    );

    const postedLabel = useMemo(() => {
        if (!job?.posted_date) return "";
        const days = Math.floor(
            (Date.now() - job.posted_date.toDate().getTime()) / 86400000
        );
        if (days <= 0) return "Posted today";
        if (days === 1) return "Posted yesterday";
        if (days < 7) return `Posted ${days} days ago`;
        return `Posted ${Math.floor(days / 7)} weeks ago`;
    }, [job]);

    const requirements = useMemo(() => {
        if (!job?.requirements) return [];
        if (Array.isArray(job.requirements)) return job.requirements.filter(Boolean);
        return job.requirements
            .split(/\r?\n+/)
            .map((r) => r.trim())
            .filter(Boolean);
    }, [job]);

    const handleApply = async () => {
        if (!job?.apply_url || applyCountdown > 0) return;

        try {
            setLocalApplied((p) => p + 1);

            incrementJobAppliedCount(job.id).catch(() => {
                setLocalApplied((p) => p - 1);
            });

            window.open(job.apply_url, "_blank");
        } catch (error) {
            console.error("Failed to update applied count", error);
        }
    };

    const handleShare = async () => {
        if (!job) return;

        const isMobileDevice = () => {
            return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        };
        const message = getShareMessage(job);

        try {
            if (isMobileDevice() && navigator.share) {
                await navigator.share({
                    title: job.title,
                    text: message,
                });
                return;
            }

            await navigator.clipboard.writeText(message);
            toast({
                title: "Copied",
                description: "Job message copied to clipboard",
            });

        } catch (error) {
            await navigator.clipboard.writeText(message);
            toast({
                title: "Copied",
                description: "Job message copied to clipboard",
            });
        }
    };

    const getShareMessage = (job: Job) => {
        const jobUrl = `https://seekjobslk.com/job/${job.id}`;

        return `📌 ${job.title}

🏢 Company: ${job.company.name}
📍 Location: ${job.location}
💼 Job Type: ${job.job_type}

🔗 Apply here:
${jobUrl}

🔔 Stay updated with new jobs

WhatsApp Group:
https://chat.whatsapp.com/DPOquPdltS281VTT4hOln4?mode=hqrt3

WhatsApp Channel:
https://whatsapp.com/channel/0029Vb70WYoD38CXiV7HaX0F`;
    };

    if (loading) {
        return <JobDetailsSkeleton />;
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
                    <Button asChild>
                        <Link to="/">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`${job.title} – ${job.company.name} | Jobs in ${job.location} | SeekJobsLK`}</title>
                <meta
                    name="description"
                    content={`${job.title} at ${job.company.name} in ${job.location}. ${job.job_type} position. Apply now on SeekJobsLK.`}
                />
                <link
                    rel="canonical"
                    href={`https://seekjobslk.com/job/${job.id}`}
                />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`${job.title} – ${job.company.name}`} />
                <meta
                    property="og:description"
                    content={`${job.location} | ${job.job_type} job opportunity`}
                />
                <meta
                    property="og:image"
                    content={job.company.logo_url}
                />
                <meta
                    property="og:url"
                    content={`https://seekjobslk.com/job/${job.id}`}
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${job.title} – ${job.company.name}`} />
                <meta
                    name="twitter:description"
                    content={`${job.location} | ${job.job_type}`}
                />
                <meta
                    name="twitter:image"
                    content={job.company.logo_url}
                />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="container mx-auto px-4 py-6 md:py-8">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <article className="lg:col-span-2 space-y-6">

                            <section className="relative rounded-xl border bg-card p-6">
                                {job.is_featured && (
                                    <div
                                        className="absolute right-0 top-0 rounded-bl-xl rounded-tr-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-current" /> Featured
                                    </div>
                                )}

                                <div className="flex gap-5">
                                    <img
                                        src={job.company.logo_url}
                                        alt={job.company.name}
                                        className="h-20 w-20 rounded-xl border object-cover"
                                    />

                                    <div className="flex-1">
                                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                            {job.title}
                                        </h1>

                                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                            <Building2 className="w-4 h-4" />

                                            {job.company.website ? (
                                                <a
                                                    href={job.company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                                                >
                                                    <span>{job.company.name}</span>
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            ) : (
                                                <span>{job.company.name}</span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            {!job.job_type?.toLowerCase().includes("remote") && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    {job.company.location}
                                                </span>
                                            )}

                                            <Badge variant="secondary">{job.job_type}</Badge>

                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {postedLabel}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-xl border bg-card p-6">
                                <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    Job Description
                                </h2>
                                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                                    {job.description}
                                </p>
                            </section>

                            <section className="rounded-xl border bg-card p-6">
                                <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    Requirements
                                </h2>

                                <ul className="space-y-3">
                                    {requirements.map((req, i) => (
                                        <li key={i} className="flex gap-3">
                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                            <span className="text-muted-foreground">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </article>

                        <aside>
                            <div className="sticky top-24 space-y-5">

                                <WhatsAppChannelBanner />

                                <section className="rounded-xl border bg-card p-6">
                                    {job.salary && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <DollarSign className="w-4 h-4" /> Salary
                                            </div>
                                            <p className="text-xl font-bold">{job.salary}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                                        <Users className="w-4 h-4" /> {appliedCount} applied
                                    </div>

                                    <div className="space-y-3">
                                        {applyCountdown > 0 && (
                                            <p className="text-sm font-medium text-red-600 text-center">
                                                Apply link will be generated in {applyCountdown} seconds
                                            </p>
                                        )}

                                        <Button
                                            size="lg"
                                            className="w-full gap-2"
                                            variant="apply"
                                            disabled={applyCountdown > 0}
                                            onClick={handleApply}
                                        >
                                            Apply Now <ExternalLink className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            size="lg"
                                            className="w-full gap-2"
                                            variant="outline"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="w-4 h-4" /> Share Job
                                        </Button>
                                    </div>
                                </section>

                                <RelatedJobsAside jobs={allJobs} currentJob={job} limit={6} />

                                <ConnectWithUs />

                                <PageViewsCounter />
                            </div>
                        </aside>

                    </div>
                </main>
            </div>
        </>
    );
};

export default JobDetails;
