"use client";

import { useEffect, useState } from "react";

interface PageViewsCounterProps {
  count: number;
}

export function PageViewsCounter({ count }: PageViewsCounterProps) {
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
      <h3 className="mt-4 text-base font-semibold text-card-foreground">Visitor Counter</h3>
      <div className="mt-4 rounded-2xl border border-border bg-background px-4 py-4">
        <p className="text-4xl font-bold tracking-tight text-card-foreground tabular-nums" aria-live="polite">
          {displayCount.toLocaleString()}
        </p>
        <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          Total platform visitors
        </p>
      </div>
    </section>
  );
}
