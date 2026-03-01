export function ConnectWithUs() {
  return (
    <section className="ui-card p-5 sm:p-6">
      <h3 className="ui-card-title">Connect With Us</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Follow SeekJobsLk on social channels for hiring tips and job updates.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Facebook page"
          className="ui-button ui-button-secondary min-h-10 px-3.5 text-sm"
        >
          Facebook
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our LinkedIn page"
          className="ui-button ui-button-secondary min-h-10 px-3.5 text-sm"
        >
          LinkedIn
        </a>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our X profile"
          className="ui-button ui-button-secondary min-h-10 px-3.5 text-sm"
        >
          X
        </a>
      </div>
    </section>
  );
}
