import { Mail, X, MessageCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

type ApplyLinkType = "email" | "whatsapp";

interface ApplyPopupProps {
    open: boolean;
    type: ApplyLinkType;
    applyUrl: string;
    onClose: () => void;
}

const normalizeEmailLink = (value: string) => {
    if (value.startsWith("mailto:")) return value;
    return `mailto:${value}`;
};

const extractEmail = (value: string) => {
    return value.replace(/^mailto:/i, "").trim();
};

const extractWhatsAppNumber = (value: string) => {
    try {
        // supports wa.me/9477xxxxxxx and whatsapp.com/send?phone=
        const url = new URL(value);
        if (url.hostname.includes("wa.me")) {
            return url.pathname.replace("/", "");
        }
        return url.searchParams.get("phone") || value;
    } catch {
        return value;
    }
};

const ApplyPopup: React.FC<ApplyPopupProps> = ({
    open,
    type,
    applyUrl,
    onClose,
}) => {
    const [copied, setCopied] = useState(false);

    if (!open) return null;

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        toast({
            title: "Copied",
            description: `${text} copied to clipboard`,
        });

        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md rounded-xl bg-background p-6 shadow-lg">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                <h3 className="mb-2 text-center text-lg font-bold">
                    Apply for this job
                </h3>

                {/* EMAIL */}
                {type === "email" && (() => {
                    const email = extractEmail(applyUrl);

                    return (
                        <>
                            <p className="mb-4 text-center text-sm text-muted-foreground">
                                Apply via Email
                            </p>

                            {/* Email display */}
                            <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                                <span className="truncate text-sm font-medium">
                                    {email}
                                </span>

                                <button
                                    onClick={() => handleCopy(email)}
                                    className="flex shrink-0 items-center gap-1.5 text-sm text-primary hover:underline"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>

                            {/* Primary action */}
                            <a
                                href={normalizeEmailLink(email)}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90"
                            >
                                <Mail className="h-4 w-4" />
                                Send Email
                            </a>
                        </>
                    );
                })()}

                {/* WHATSAPP */}
                {type === "whatsapp" && (() => {
                    const number = extractWhatsAppNumber(applyUrl);

                    return (
                        <>
                            <p className="mb-3 text-center text-sm text-muted-foreground">
                                Apply via WhatsApp
                            </p>

                            <div className="mb-3 rounded-lg border px-3 py-2 text-sm">
                                {number}
                            </div>

                            <a
                                href={applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:opacity-90"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Chat on WhatsApp
                            </a>

                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={() => handleCopy(number)}
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                Copy WhatsApp Number
                            </Button>
                        </>
                    );
                })()}

                <Button
                    variant="ghost"
                    className="mt-4 w-full"
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default ApplyPopup;
