import { ExternalLink } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

export default function WhatsAppChannelBanner() {
    return (
        <a
            href="https://whatsapp.com/channel/0029Vb70WYoD38CXiV7HaX0F"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
        >
            <div className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-200/40 via-emerald-200/40 to-green-200/40 blur-xl" />
                </div>

                <div className="relative z-10 flex items-center gap-5">
                    <div className="relative">
                        <OptimizedImage
                            src="/whatsapp.svg"
                            alt="WhatsApp"
                            width={48}
                            height={48}
                            lazy={false}
                            skeleton={false}
                            className="h-12 w-12 animate-pulse-soft"
                        />
                    </div>
                    <div className="leading-tight text-center">
                        <p className="text-[13px] font-medium text-green-700">
                            Follow the Channel
                        </p>
                        <p className="text-2xl font-extrabold animate-seekjobs-gradient">
                            SeekJobsLk
                        </p>
                        <span className="inline-block mt-1 rounded-full py-0.5 text-[11px] font-semibold text-green-800">
                            🔔 Daily Job Alerts • Free
                        </span>
                    </div>
                </div>
                <div className="relative z-10 flex items-center">
                    <OptimizedImage
                        src="/handtap.gif"
                        alt="Click Here"
                        width={64}
                        height={64}
                        lazy={false}
                        skeleton={false}
                        className="h-16 w-16 animate-float"
                    />
                </div>
            </div>
        </a>
    );
}
