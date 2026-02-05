import type { JobDate } from "@/types";

function isTimestampLike(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  );
}

function isSecondsObject(
  value: unknown,
): value is { seconds?: number; nanoseconds?: number } {
  return typeof value === "object" && value !== null && "seconds" in value;
}

export function getJobDate(jobDate: JobDate): Date | null {
  if (!jobDate) {
    return null;
  }

  if (isTimestampLike(jobDate)) {
    const date = jobDate.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (jobDate instanceof Date) {
    return Number.isNaN(jobDate.getTime()) ? null : jobDate;
  }

  if (typeof jobDate === "string") {
    const date = new Date(jobDate);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (isSecondsObject(jobDate) && typeof jobDate.seconds === "number") {
    const nano = typeof jobDate.nanoseconds === "number" ? jobDate.nanoseconds : 0;
    const date = new Date(jobDate.seconds * 1000 + Math.floor(nano / 1_000_000));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function getJobTimestamp(jobDate: JobDate): number {
  const date = getJobDate(jobDate);
  return date ? date.getTime() : 0;
}

export function toIsoString(jobDate: JobDate): string | null {
  const date = getJobDate(jobDate);
  return date ? date.toISOString() : null;
}
