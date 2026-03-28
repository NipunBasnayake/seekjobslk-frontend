"use client";

import { useEffect, useState } from "react";

export interface VisitorCountCardProps {
  count: number;
}

export function VisitorCountCard({ count }: VisitorCountCardProps) {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 600;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setDisplayCount(Math.floor(progress * count));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [count]);

  return (
    <section className="ui-card p-5 sm:p-6">
      <span className="ui-kicker">Traffic</span>
      <div className="mt-4 space-y-1">
        <h3 className="ui-card-title">Visitor Counter</h3>
        <p className="ui-section-subtitle">A live snapshot of platform traffic.</p>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-end justify-between gap-3">
          <p
            className="text-4xl font-bold tracking-tight text-card-foreground tabular-nums sm:text-[2.75rem]"
            aria-live="polite"
          >
            {displayCount.toLocaleString()}
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            Live
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Total platform visitors</p>
      </div>
    </section>
  );
}

export { VisitorCountCard as PageViewsCounter };
