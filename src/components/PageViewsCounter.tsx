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
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h3 className="text-base font-semibold text-card-foreground">Visitor Counter</h3>
      <p className="mt-2 text-3xl font-bold text-primary">{displayCount.toLocaleString()}</p>
      <p className="mt-1 text-sm text-muted-foreground">Total platform visitors</p>
    </section>
  );
}
