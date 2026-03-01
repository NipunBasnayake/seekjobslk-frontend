import { JobCardSkeleton } from "@/components/JobCardSkeleton";

export default function HomeLoading() {
  return (
    <main className="ui-shell space-y-6 py-6 sm:space-y-8 sm:py-8 lg:py-10">
      <div className="h-32 animate-pulse rounded-[16px] bg-muted" />
      <div className="h-32 animate-pulse rounded-[16px] bg-muted" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-[16px] bg-muted" />
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-56 animate-pulse rounded-[16px] bg-muted" />
          <div className="h-44 animate-pulse rounded-[16px] bg-muted" />
        </div>
      </div>
    </main>
  );
}
