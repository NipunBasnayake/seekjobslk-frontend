export function JobCardSkeleton() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6"
      role="presentation"
      aria-hidden="true"
    >
      {/* Top section with logo and title */}
      <div className="flex items-start gap-4">
        {/* Logo skeleton */}
        <div className="size-14 shrink-0 rounded-xl bg-surface-strong animate-skeleton sm:size-16" />

        <div className="min-w-0 flex-1 space-y-3">
          {/* Title skeleton */}
          <div className="h-5 w-3/4 rounded-lg bg-surface-strong animate-skeleton sm:h-6" />

          {/* Company name skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-4 w-24 rounded-lg bg-surface-strong animate-skeleton" />
          </div>
        </div>
      </div>

      {/* Tags section */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="h-8 w-20 rounded-lg bg-surface-strong animate-skeleton" />
        <div className="h-8 w-24 rounded-lg bg-surface-strong animate-skeleton" />
        <div className="h-8 w-28 rounded-lg bg-surface-strong animate-skeleton" />
        <div className="h-8 w-20 rounded-lg bg-surface-strong animate-skeleton" />
      </div>

      {/* Footer section */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="h-4 w-28 rounded-lg bg-surface-strong animate-skeleton" />
        <div className="h-4 w-20 rounded-lg bg-surface-strong animate-skeleton" />
      </div>
    </div>
  );
}
