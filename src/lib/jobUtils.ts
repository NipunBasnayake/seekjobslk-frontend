export type JobDateInput =
  | { toDate?: () => Date }
  | { seconds?: number; nanoseconds?: number }
  | Date
  | string
  | number
  | null
  | undefined;

export const getJobDate = (value: JobDateInput): Date | null => {
  if (!value) return null;

  if (value instanceof Date) return value;

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === "object") {
    if (typeof (value as { toDate?: () => Date }).toDate === "function") {
      return (value as { toDate: () => Date }).toDate();
    }

    if (typeof (value as { seconds?: number }).seconds === "number") {
      return new Date((value as { seconds: number }).seconds * 1000);
    }
  }

  return null;
};

export const getJobTimestamp = (value: JobDateInput): number => {
  const date = getJobDate(value);
  return date ? date.getTime() : 0;
};

export const toIsoString = (value: JobDateInput): string => {
  const date = getJobDate(value);
  return date ? date.toISOString() : new Date().toISOString();
};

export const stripMarkdown = (input: string): string => {
  return input
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*_~`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const buildJobExcerpt = (
  description?: string,
  requirements?: string[] | string,
  maxLength: number = 180
): string => {
  const requirementsText = Array.isArray(requirements)
    ? requirements.join(" ")
    : requirements || "";

  const combined = [description || "", requirementsText].join(" ").trim();
  const clean = stripMarkdown(combined);

  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trim()}…`;
};

export const ensureAbsoluteUrl = (
  value: string | undefined | null,
  baseUrl: string,
  fallbackPath: string
): string => {
  if (!value) return `${baseUrl}${fallbackPath}`;

  if (value.startsWith("https://")) return value;
  if (value.startsWith("http://")) return value.replace("http://", "https://");
  if (value.startsWith("/")) return `${baseUrl}${value}`;

  return `${baseUrl}/${value}`;
};

