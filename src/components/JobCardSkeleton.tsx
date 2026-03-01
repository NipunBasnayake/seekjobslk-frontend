export function JobCardSkeleton() {
  return (
    <div className="ui-card p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="size-12 animate-pulse rounded-2xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
        <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mb-3 h-3 w-full animate-pulse rounded bg-muted" />
      <div className="mb-5 h-3 w-1/2 animate-pulse rounded bg-muted" />
      <div className="flex justify-between">
        <div className="h-11 w-28 animate-pulse rounded-2xl bg-muted" />
        <div className="h-11 w-32 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
