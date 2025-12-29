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
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobDetailsSkeleton from "@/components/JobDetailsSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

import {
    getJobById,
    getJobs,
    incrementJobAppliedCount,
} from "@/services/firebaseData";

import type { Job } from "@/types";

import ConnectWithUs from "@/components/ConnectWithUs";
import PageViewsCounter from "@/components/PageViewsCounter";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";
import RelatedJobsAside from "@/components/RelatedJobsAside";
import ApplyPopup from "@/components/ApplyPopup";

import JobContent from "@/components/JobContent";

type ApplyLinkType = "url" | "email" | "whatsapp" | "unknown";

const APPLY_DELAY = 8;

const JobDetails: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applyCountdown, setApplyCountdown] = useState(APPLY_DELAY);
    const [localApplied, setLocalApplied] = useState(0);
    const [allJobs, setAllJobs] = useState<Job[] | null>(null);
    const [showApplyPopup, setShowApplyPopup] = useState(false);
    const [applyType, setApplyType] = useState<"email" | "whatsapp">("email");

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

    const detectApplyLinkType = (applyUrl: string): ApplyLinkType => {
        const url = applyUrl.trim().toLowerCase();

        if (url.startsWith("mailto:") || /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(url)) {
            return "email";
        }

        if (
            url.startsWith("https://wa.me/") ||
            url.startsWith("http://wa.me/") ||
            url.includes("whatsapp.com")
        ) {
            return "whatsapp";
        }

        if (url.startsWith("http://") || url.startsWith("https://")) {
            return "url";
        }

        return "unknown";
    };

    const handleApply = async () => {
        if (!job?.apply_url || applyCountdown > 0) return;

        const type = detectApplyLinkType(job.apply_url);

        setLocalApplied((p) => p + 1);
        incrementJobAppliedCount(job.id).catch(() =>
            setLocalApplied((p) => p - 1)
        );

        if (type === "url") {
            window.open(job.apply_url, "_blank", "noopener,noreferrer");
            return;
        }

        if (type === "email" || type === "whatsapp") {
            setApplyType(type);
            setShowApplyPopup(true);
        }
    };

    const handleShare = async () => {
        if (!job) return;

        const jobUrl = `https://seekjobslk.com/job/${job.id}`;

        const message = `*📌 ${job.title}*

🏢 Company: ${job.company.name}
📍 Location: ${job.location}
💼 Job Type: ${job.job_type}

Apply here:
${jobUrl}

WhatsApp Channel:
https://whatsapp.com/channel/0029Vb70WYoD38CXiV7HaX0F

> Follow our WhatsApp Channel and enable 🔔 notifications.`;

        try {
            await navigator.clipboard.writeText(message);
            toast({
                title: "Copied to clipboard",
                description: "Job details are ready to share",
            });
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = message;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);

            toast({
                title: "Copied to clipboard",
                description: "Job details are ready to share",
            });
        }
    };

    if (loading) return <JobDetailsSkeleton />;

    if (!job) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
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

    return (
        <>
            <Helmet>
                <title>{`${job.title} at ${job.company.name} | SeekJobsLK`}</title>
                <meta
                    name="description"
                    content={`Apply for ${job.title} at ${job.company.name} in ${job.location}. ${job.job_type} position. View salary, requirements, and apply now.`}
                />
                <meta
                    name="keywords"
                    content={`${job.title}, ${job.company.name}, jobs in ${job.location}, Sri Lanka jobs, ${job.job_type}`}
                />
                <link
                    rel="canonical"
                    href={`https://seekjobslk.com/job/${job.id}`}
                />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={`${job.title} – ${job.company.name}`} />
                <meta
                    property="og:description"
                    content={`📍 ${job.location} | 💼 ${job.job_type}\nApply now on SeekJobsLK`}
                />
                <meta
                    property="og:url"
                    content={`https://seekjobslk.com/job/${job.id}`}
                />
                <meta
                    property="og:image"
                    content={job.company.logo_url}
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${job.title} – ${job.company.name}`} />
                <meta
                    name="twitter:description"
                    content={`Apply for ${job.title} at ${job.company.name}`}
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
                                    <div className="absolute right-0 top-0 rounded-bl-xl rounded-tr-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-current" />
                                        Featured
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
                                            <span>{job.company.name}</span>
                                            {job.company.website && (
                                                <a
                                                    href={job.company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-primary hover:underline"
                                                    aria-label={`Visit ${job.company.name} website`}
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                {job.location}
                                            </span>

                                            <Badge variant="secondary">{job.job_type}</Badge>

                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {postedLabel}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <JobContent
                                description={job.description}
                                requirements={job.requirements}
                            />

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
                                        <Users className="w-4 h-4" />
                                        {appliedCount} applied
                                    </div>

                                    {applyCountdown > 0 && (
                                        <p className="text-sm font-medium text-red-600 text-center mb-2">
                                            Apply link will be generated in {applyCountdown} seconds
                                        </p>
                                    )}

                                    <div className="space-y-3">
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
                                            <Share2 className="w-4 h-4" />
                                            Share Job
                                        </Button>
                                    </div>
                                </section>

                                <RelatedJobsAside
                                    jobs={allJobs}
                                    currentJob={job}
                                    limit={6}
                                />

                                <ConnectWithUs />
                                <PageViewsCounter />

                                <ApplyPopup
                                    open={showApplyPopup}
                                    type={applyType}
                                    applyUrl={job.apply_url}
                                    onClose={() => setShowApplyPopup(false)}
                                />
                            </div>
                        </aside>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default JobDetails;
