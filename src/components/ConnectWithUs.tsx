export function ConnectWithUs() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-3 text-base font-semibold text-card-foreground">Connect With Us</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Follow SeekJobsLk on social channels for hiring tips and job updates.
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-border px-3 py-2 text-sm transition hover:border-primary/40"
        >
          Facebook
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-border px-3 py-2 text-sm transition hover:border-primary/40"
        >
          LinkedIn
        </a>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-border px-3 py-2 text-sm transition hover:border-primary/40"
        >
          X
        </a>
      </div>
    </section>
  );
}
