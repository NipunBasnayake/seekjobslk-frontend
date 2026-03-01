import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="ui-shell flex min-h-[70vh] items-center justify-center py-10">
      <div className="ui-card max-w-md p-8 text-center sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-card-foreground">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page you are looking for does not exist or may have been removed.
        </p>
        <Link
          href="/"
          className="ui-button ui-button-primary mt-6"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
