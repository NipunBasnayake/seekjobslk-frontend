import type { Job } from "@/types";

export type ApplyTarget =
  | { kind: "none" }
  | { kind: "url"; url: string }
  | { kind: "email"; email: string; mailto: string }
  | { kind: "phone"; phone: string; tel: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const PHONE_PATTERN = /^[+]?[\d\s().-]{6,}$/;

export function sanitizeExternalUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function sanitizeEmail(value: string): string | null {
  const normalized = value.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(normalized)) {
    return null;
  }

  return normalized;
}

function sanitizePhone(value: string): string | null {
  const normalized = value.trim();
  if (!PHONE_PATTERN.test(normalized)) {
    return null;
  }

  return normalized;
}

function parseMailto(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed.toLowerCase().startsWith("mailto:")) {
    return null;
  }

  const rawEmail = trimmed.slice(7).split("?")[0];
  return sanitizeEmail(rawEmail);
}

function parseTel(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed.toLowerCase().startsWith("tel:")) {
    return null;
  }

  const rawPhone = trimmed.slice(4).split("?")[0];
  return sanitizePhone(rawPhone);
}

export function parseApplyTarget(job: Pick<Job, "apply_url" | "apply_email" | "apply_phone">): ApplyTarget {
  const explicitEmail = job.apply_email ? sanitizeEmail(job.apply_email) : null;
  if (explicitEmail) {
    return {
      kind: "email",
      email: explicitEmail,
      mailto: `mailto:${explicitEmail}`,
    };
  }

  const explicitPhone = job.apply_phone ? sanitizePhone(job.apply_phone) : null;
  if (explicitPhone) {
    return {
      kind: "phone",
      phone: explicitPhone,
      tel: `tel:${explicitPhone}`,
    };
  }

  const applyUrl = job.apply_url?.trim();
  if (!applyUrl) {
    return { kind: "none" };
  }

  const mailtoFromUrl = parseMailto(applyUrl);
  if (mailtoFromUrl) {
    return {
      kind: "email",
      email: mailtoFromUrl,
      mailto: `mailto:${mailtoFromUrl}`,
    };
  }

  const telFromUrl = parseTel(applyUrl);
  if (telFromUrl) {
    return {
      kind: "phone",
      phone: telFromUrl,
      tel: `tel:${telFromUrl}`,
    };
  }

  const emailFromUrl = sanitizeEmail(applyUrl);
  if (emailFromUrl) {
    return {
      kind: "email",
      email: emailFromUrl,
      mailto: `mailto:${emailFromUrl}`,
    };
  }

  const phoneFromUrl = sanitizePhone(applyUrl);
  if (phoneFromUrl) {
    return {
      kind: "phone",
      phone: phoneFromUrl,
      tel: `tel:${phoneFromUrl}`,
    };
  }

  const sanitizedUrl = sanitizeExternalUrl(applyUrl);
  if (sanitizedUrl) {
    return {
      kind: "url",
      url: sanitizedUrl,
    };
  }

  return { kind: "none" };
}
