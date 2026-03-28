import { Check, Copy, Mail, Phone, X } from "lucide-react";
import { Modal } from "@/components/Modal";
import { cn } from "@/lib/cn";
import React from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  kind: "email" | "phone";
  contactValue: string;
  contactHref: string;
  copied: boolean;
  handleCopy: () => void;
}

export function ContactModal({
  open,
  onClose,
  kind,
  contactValue,
  contactHref,
  copied,
  handleCopy,
}: ContactModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={kind === "email" ? "Apply via Email" : "Apply via Whatsapp"}
      description={
        kind === "email"
          ? "Use the verified email below to send your application."
          : "Use the verified phone number below to contact the recruiter."
      }
    >
      <div className="rounded-xl border border-primary/20 bg-primary-subtle p-4 flex items-center justify-between gap-2">
        <p className="break-all text-lg font-semibold text-card-foreground flex-1 text-center">
          {kind === "phone" && contactValue.startsWith("http")
            ? contactValue.replace(/https:\/\/wa\.me\//, "")
            : contactValue}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "ml-2 p-1 rounded hover:bg-primary/10 transition-colors",
            copied ? "text-primary" : "text-muted-foreground"
          )}
          aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        >
          {copied ? (
            <Check className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Copy className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="mt-4">
        <a
          href={kind === "email" ? `mailto:${contactValue}` : contactValue}
          target={kind === "phone" ? "_blank" : undefined}
          rel={kind === "phone" ? "noopener noreferrer" : undefined}
          className="ui-button ui-button-primary w-full flex justify-center items-center gap-2"
          style={{ minWidth: 0 }}
        >
          {kind === "email" ? (
            <>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Open Email App
            </>
          ) : (
            <>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Whatsapp Now
            </>
          )}
        </a>
      </div>

      {copied && (
        <p
          className="mt-3 text-center text-sm font-medium text-success"
          role="status"
          aria-live="polite"
        >
          Contact information copied to clipboard
        </p>
      )}
    </Modal>
  );
}