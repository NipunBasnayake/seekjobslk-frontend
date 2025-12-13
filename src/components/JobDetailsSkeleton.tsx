import React from "react";

const Block = ({ className }: { className: string }) => (
    <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

const JobDetailsSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar placeholder */}
            <div className="h-20 border-b" />

            <main className="container mx-auto px-4 py-6 md:py-8">
                {/* Back button */}
                <Block className="h-8 w-32 mb-6" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ================= Main ================= */}
                    <article className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <section className="relative rounded-xl border bg-card p-6">
                            <div className="flex gap-5">
                                <Block className="h-20 w-20 rounded-xl" />

                                <div className="flex-1 space-y-3">
                                    <Block className="h-7 w-3/4" />
                                    <Block className="h-4 w-1/3" />

                                    <div className="flex gap-3 mt-2">
                                        <Block className="h-4 w-24" />
                                        <Block className="h-6 w-20 rounded-full" />
                                        <Block className="h-4 w-28" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Description */}
                        <section className="rounded-xl border bg-card p-6 space-y-4">
                            <Block className="h-5 w-48" />
                            <Block className="h-4 w-full" />
                            <Block className="h-4 w-full" />
                            <Block className="h-4 w-5/6" />
                        </section>

                        {/* Requirements */}
                        <section className="rounded-xl border bg-card p-6 space-y-4">
                            <Block className="h-5 w-40" />
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <Block className="h-2 w-2 rounded-full mt-2" />
                                    <Block className="h-4 w-full" />
                                </div>
                            ))}
                        </section>
                    </article>

                    {/* ================= Sidebar ================= */}
                    <aside className="space-y-5">
                        {/* Apply Card */}
                        <section className="sticky top-24 rounded-xl border bg-card p-6 space-y-5">
                            <div>
                                <Block className="h-4 w-20 mb-2" />
                                <Block className="h-7 w-32" />
                            </div>

                            <Block className="h-4 w-28" />

                            <div className="space-y-3">
                                <Block className="h-11 w-full rounded-md" />
                                <Block className="h-11 w-full rounded-md" />
                            </div>
                        </section>

                        {/* Company */}
                        <section className="rounded-xl border bg-card p-6 space-y-4">
                            <Block className="h-4 w-40" />

                            <div className="flex items-center gap-3">
                                <Block className="h-12 w-12 rounded-lg" />

                                <div className="space-y-2">
                                    <Block className="h-4 w-32" />
                                    <Block className="h-3 w-40" />
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default JobDetailsSkeleton;
