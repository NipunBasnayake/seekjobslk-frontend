import { ArrowUpRight, MessageCircle } from "lucide-react";

export function WhatsAppChannelBanner() {
  const channelUrl =
    process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL ||
    "https://whatsapp.com/channel/seekjobslk";

  return (
    <section className="rounded-2xl border border-emerald-300/50 bg-gradient-to-r from-emerald-100 via-emerald-50 to-teal-100 p-5 shadow-card dark:border-emerald-700/40 dark:from-emerald-900/30 dark:via-emerald-950 dark:to-teal-900/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-200">
            <MessageCircle className="size-5" />
            <span>Join our WhatsApp channel</span>
          </h2>
          <p className="text-sm text-emerald-800/80 dark:text-emerald-200/80">
            Daily new job alerts, urgent vacancies, and hiring updates from Sri Lanka.
          </p>
        </div>

        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <span>Follow on WhatsApp</span>
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </section>
  );
}
