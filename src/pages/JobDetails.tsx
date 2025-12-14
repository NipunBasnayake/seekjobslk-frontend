import React, {useEffect, useMemo, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {Helmet} from "react-helmet-async";
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
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {toast} from "@/hooks/use-toast";
import {getJobById} from "@/services/firebaseData";
import type {Job} from "@/types";

const APPLY_DELAY = 15;

const JobDetails: React.FC = () => {
    const {jobId} = useParams<{ jobId: string }>();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applyCountdown, setApplyCountdown] = useState(APPLY_DELAY);
    const [localApplied, setLocalApplied] = useState(0);

    /* ----------------------------- Load job ----------------------------- */
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

    /* ----------------------- Apply countdown ---------------------------- */
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

    /* ----------------------------- Derived ------------------------------ */
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

    /* ----------------------------- Actions ------------------------------ */
    const handleApply = () => {
        if (!job?.apply_url || applyCountdown > 0) return;
        setLocalApplied((p) => p + 1);
        window.open(job.apply_url, "_blank");
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

    /* ----------------------------- States ------------------------------- */
    if (loading) {
        return <JobDetailsSkeleton/>;
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar/>
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
                    <Button asChild>
                        <Link to="/">
                            <ArrowLeft className="w-4 h-4 mr-2"/> Back to Jobs
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    /* ----------------------------- UI ---------------------------------- */
    return (
        <>
            <Helmet>
                <title>{`${job.title} at ${job.company.name} | SeekJobsLk`}</title>
                <meta name="description" content={job.description}/>
                <link rel="canonical" href={`https://seekjobslk.com/job/${job.id}`}/>
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar/>

                <main className="container mx-auto px-4 py-6 md:py-8">
                    <Button variant="ghost" asChild className="mb-6 gap-2">
                        <Link to="/">
                            <ArrowLeft className="w-4 h-4"/> Back to Jobs
                        </Link>
                    </Button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ================= Main ================= */}
                        <article className="lg:col-span-2 space-y-6">
                            {/* Header */}
                            <section className="relative rounded-xl border bg-card p-6">
                                {job.is_featured && (
                                    <div
                                        className="absolute right-0 top-0 rounded-bl-xl rounded-tr-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-current"/> Featured
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
                                            <Building2 className="w-4 h-4"/>
                                            {job.company.name}
                                        </div>

                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            {!job.job_type?.toLowerCase().includes("remote") && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-primary"/>
                                                    {job.location}
                                                </span>
                                            )}

                                            <Badge variant="secondary">{job.job_type}</Badge>

                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4"/>
                                                {postedLabel}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Description */}
                            <section className="rounded-xl border bg-card p-6">
                                <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                                    <Briefcase className="w-5 h-5 text-primary"/>
                                    Job Description
                                </h2>
                                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                                    {job.description}
                                </p>
                            </section>

                            {/* Requirements */}
                            <section className="rounded-xl border bg-card p-6">
                                <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                                    <CheckCircle2 className="w-5 h-5 text-primary"/>
                                    Requirements
                                </h2>

                                <ul className="space-y-3">
                                    {requirements.map((req, i) => (
                                        <li key={i} className="flex gap-3">
                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary"/>
                                            <span className="text-muted-foreground">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </article>

                        {/* ================= Sidebar ================= */}
                        <aside className="space-y-5">
                            <section className="sticky top-24 rounded-xl border bg-card p-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <DollarSign className="w-4 h-4"/> Salary
                                    </div>
                                    <p className="text-xl font-bold">{job.salary}</p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                                    <Users className="w-4 h-4"/> {appliedCount} applied
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        size="lg"
                                        className="w-full gap-2"
                                        variant="apply"
                                        disabled={applyCountdown > 0}
                                        onClick={handleApply}
                                    >
                                        {applyCountdown > 0
                                            ? `Apply available in ${applyCountdown}s`
                                            : (
                                                <>
                                                    Apply Now <ExternalLink className="w-4 h-4"/>
                                                </>
                                            )}
                                    </Button>

                                    <Button
                                        size="lg"
                                        className="w-full gap-2"
                                        variant="outline"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="w-4 h-4"/> Share Job
                                    </Button>
                                </div>
                            </section>

                            {/* Company */}
                            <section className="rounded-xl border bg-card p-6">
                                <h3 className="font-semibold mb-4">About the Company</h3>

                                <div className="flex items-center gap-3">
                                    <img
                                        src={job.company.logo_url}
                                        alt={job.company.name}
                                        className="h-12 w-12 rounded-lg border object-cover"
                                    />

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{job.company.name}</p>

                                            {job.company.website && (
                                                <a
                                                    href={job.company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4"/>
                                                </a>
                                            )}
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            {job.company.location ?? "Sri Lanka"}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    );
};

export default JobDetails;
