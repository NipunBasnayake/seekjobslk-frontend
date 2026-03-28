import Image from "next/image";

export default function WhatsAppChannelBanner() {
  return (
    <a
      href="https://whatsapp.com/channel/0029Vb70WYoD38CXiV7HaX0F"
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      aria-label="Follow SeekJobsLk on WhatsApp for daily job alerts"
    >
      <div className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-green-200 bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-green-200/40 via-emerald-200/40 to-green-200/40 blur-xl" />
        </div>

        <div className="relative z-10 flex w-full items-center gap-4">
          <div className="flex flex-1 justify-center">
            <Image
              src="/images/whatsapp-logo.svg"
              alt="WhatsApp"
              width={48}
              height={48}
              className="h-12 w-12"
            />
          </div>

          <div className="flex flex-1 flex-col items-center text-center leading-tight">
            <p className="text-[13px] font-medium text-green-700">Follow the Channel</p>
            <p className="text-2xl font-extrabold text-green-900">SeekJobsLk</p>
            <span className="mt-1 rounded-full py-0.5 text-[11px] font-semibold text-green-800">
              Daily job alerts • Free
            </span>
          </div>

          <div className="flex flex-1 justify-center">
            <Image
              src="/images/handtap.gif"
              alt="Tap to join"
              width={64}
              height={64}
              className="h-16 w-16"
              unoptimized
            />
          </div>
        </div>
      </div>
    </a>
  );
}
