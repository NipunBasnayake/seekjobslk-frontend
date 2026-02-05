export function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-start gap-3">
        <div className="size-12 animate-pulse rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mb-3 h-3 w-full animate-pulse rounded bg-muted" />
      <div className="mb-5 h-3 w-1/2 animate-pulse rounded bg-muted" />
      <div className="flex justify-between">
        <div className="h-9 w-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
