import { Navbar } from "@/components/Navbar";

export default function JobDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="ui-shell space-y-6 py-6 sm:space-y-8 sm:py-8 lg:py-10">
        <div className="h-6 w-56 animate-pulse rounded-xl bg-muted" />
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        <div className="h-60 animate-pulse rounded-2xl bg-muted" />
      </main>
    </>
  );
}
