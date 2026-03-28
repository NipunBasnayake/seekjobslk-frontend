export function JobCardSkeleton() {
  return (
    <div className="ui-card animate-pulse p-5 sm:p-6" aria-hidden="true">
      {/* Header with logo and title */}
      <div className="flex items-start gap-4">
        <div className="size-14 shrink-0 rounded-xl bg-muted sm:size-16" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-5 w-4/5 rounded-md bg-muted sm:h-6" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-5 w-16 rounded-full bg-muted" />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="h-7 w-20 rounded-lg bg-muted" />
        <div className="h-7 w-24 rounded-lg bg-muted" />
        <div className="h-7 w-28 rounded-lg bg-muted" />
        <div className="h-7 w-20 rounded-lg bg-muted" />
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
      </div>
    </div>
  );
}
