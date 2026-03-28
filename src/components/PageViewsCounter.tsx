"use client";

export interface VisitorCountCardProps {
  count: number;
}

export function VisitorCountCard({ count }: VisitorCountCardProps) {
  return (
    <section className="ui-card p-4">
      <h3 className="ui-card-title text-sm">Visitor Counter</h3>
      <p className="mt-2 text-2xl font-bold tabular-nums">
        {count.toLocaleString()}
      </p>
    </section>
  );
}

export { VisitorCountCard as PageViewsCounter };