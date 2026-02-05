import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <h1 className="text-2xl font-bold text-card-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or may have been removed.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
