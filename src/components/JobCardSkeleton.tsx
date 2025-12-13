import React from "react";

const JobCardSkeleton: React.FC = () => {
    return (
        <article
            className="
        relative
        bg-card border border-border
        rounded-2xl
        p-6 md:p-7
        shadow-card
        animate-pulse
        max-w-[520px] w-full
      "
        >
            {/* Featured placeholder */}
            <div className="absolute top-0 right-0 h-6 w-20 rounded-bl-2xl rounded-tr-2xl bg-muted" />

            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl bg-muted" />

                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
            </div>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-6 w-20 rounded-full bg-muted" />
            </div>

            {/* Posted */}
            <div className="mt-2 h-3 w-32 rounded bg-muted" />

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-9 w-24 rounded-md bg-muted" />
            </div>
        </article>
    );
};

export default JobCardSkeleton;
