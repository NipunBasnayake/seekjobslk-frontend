import type { Category, Company, Job, JobDate } from "@/types";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as UnknownRecord;
}

function readString(record: UnknownRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value !== "string") {
      continue;
    }

    const trimmed = value.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
}

function readNumber(record: UnknownRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function readBoolean(record: UnknownRecord, keys: string[]): boolean | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") {
        return true;
      }

      if (normalized === "false") {
        return false;
      }
    }
  }

  return undefined;
}

function readStringList(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const entries = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

    return entries.length ? entries : undefined;
  }

  if (typeof value === "string") {
    const normalized = value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    return normalized.length ? normalized : undefined;
  }

  return undefined;
}

export function toSerializableJobDate(value: unknown): JobDate {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  if (typeof value === "object") {
    const record = value as { seconds?: unknown; nanoseconds?: unknown; toDate?: unknown };
    if (typeof record.toDate === "function") {
      const convertedDate = (record.toDate as () => Date)();
      return Number.isNaN(convertedDate.getTime()) ? null : convertedDate.toISOString();
    }

    if (typeof record.seconds === "number") {
      return {
        seconds: record.seconds,
        nanoseconds: typeof record.nanoseconds === "number" ? record.nanoseconds : 0,
      };
    }
  }

  return null;
}

function mapCompanyFromRecord(id: string, record: UnknownRecord): Company {
  return {
    id,
    name: readString(record, ["name"]) ?? "Unknown Company",
    logo_url: readString(record, ["logo_url", "logo", "logoUrl"]),
    website: readString(record, ["website", "site_url", "url"]),
    email: readString(record, ["email", "contact_email"]),
    phone: readString(record, ["phone", "contact_phone"]),
    location: readString(record, ["location"]),
    description: readString(record, ["description"]),
    created_at: toSerializableJobDate(record.created_at),
    updated_at: toSerializableJobDate(record.updated_at),
  };
}

function mapCategoryFromRecord(id: string, record: UnknownRecord): Category {
  return {
    id,
    name: readString(record, ["name"]) ?? "General",
    slug: readString(record, ["slug"]),
    description: readString(record, ["description"]),
    created_at: toSerializableJobDate(record.created_at),
    updated_at: toSerializableJobDate(record.updated_at),
  };
}

function buildApplyUrl(record: UnknownRecord): string | undefined {
  const url = readString(record, ["apply_url", "applyUrl", "application_url", "applicationUrl", "apply_link"]);
  if (url) {
    return url;
  }

  const email = readString(record, ["apply_email", "applyEmail", "email"]);
  if (email) {
    return `mailto:${email}`;
  }

  const phone = readString(record, ["apply_phone", "applyPhone", "phone"]);
  if (phone) {
    return `tel:${phone}`;
  }

  return undefined;
}

function normalizeWorkMode(record: UnknownRecord): string | undefined {
  const workMode = readString(record, ["work_mode", "workMode"]);
  if (workMode) {
    return workMode;
  }

  const remoteFlag = readBoolean(record, ["is_remote", "remote", "isRemote"]);
  if (remoteFlag === true) {
    return "Remote";
  }

  return undefined;
}

export function mapEmbeddedCompany(data: unknown): Company | undefined {
  const record = asRecord(data);
  if (!record) {
    return undefined;
  }

  const id = readString(record, ["id", "company_id"]) ?? "";
  return mapCompanyFromRecord(id, record);
}

export function mapEmbeddedCategory(data: unknown): Category | undefined {
  const record = asRecord(data);
  if (!record) {
    return undefined;
  }

  const id = readString(record, ["id", "category_id"]) ?? "";
  return mapCategoryFromRecord(id, record);
}

export function mapCompany(id: string, data: unknown): Company {
  const record = asRecord(data);
  if (!record) {
    return {
      id,
      name: "Unknown Company",
    };
  }

  return mapCompanyFromRecord(id, record);
}

export function mapCategory(id: string, data: unknown): Category {
  const record = asRecord(data);
  if (!record) {
    return {
      id,
      name: "General",
    };
  }

  return mapCategoryFromRecord(id, record);
}

export function mapJob(id: string, data: unknown): Job {
  const record = asRecord(data);
  if (!record) {
    return {
      id,
      title: "Untitled Job",
      salary_min: null,
      salary_max: null,
      is_active: true,
      is_featured: false,
      applied_count: 0,
      posted_date: null,
      deadline: null,
      created_at: null,
      updated_at: null,
    };
  }

  const salaryMin = readNumber(record, ["salary_min", "salaryMin"]);
  const salaryMax = readNumber(record, ["salary_max", "salaryMax"]);
  const salaryText = readString(record, ["salary_text", "salaryText", "salary_range", "salaryRange", "salary"]);

  const requirements = readStringList(record.requirements) ?? (typeof record.requirements === "string" ? record.requirements : undefined);
  const responsibilities =
    readStringList(record.responsibilities) ?? (typeof record.responsibilities === "string" ? record.responsibilities : undefined);
  const benefits = readStringList(record.benefits) ?? (typeof record.benefits === "string" ? record.benefits : undefined);
  const skills = readStringList(record.skills) ?? (typeof record.skills === "string" ? record.skills : undefined);

  return {
    id,
    title: readString(record, ["title", "role"]) ?? "Untitled Job",
    description: readString(record, ["description", "summary"]),
    requirements,
    responsibilities,
    benefits,
    skills,
    location: readString(record, ["location", "city", "address"]),
    job_type: readString(record, ["job_type", "jobType", "type"]),
    employment_type: readString(record, ["employment_type", "employmentType"]),
    work_mode: normalizeWorkMode(record),
    salary_text: salaryText,
    salary_currency: readString(record, ["salary_currency", "salaryCurrency", "currency"]),
    salary_min: salaryMin ?? null,
    salary_max: salaryMax ?? null,
    apply_url: buildApplyUrl(record),
    apply_email: readString(record, ["apply_email", "applyEmail"]),
    apply_phone: readString(record, ["apply_phone", "applyPhone"]),
    is_active: readBoolean(record, ["is_active", "isActive"]) ?? true,
    is_featured: readBoolean(record, ["is_featured", "featured", "isFeatured"]) ?? false,
    applied_count: readNumber(record, ["applied_count", "appliedCount", "applications"]) ?? 0,
    category_id: readString(record, ["category_id", "categoryId"]),
    company_id: readString(record, ["company_id", "companyId"]),
    company: mapEmbeddedCompany(record.company),
    category: mapEmbeddedCategory(record.category),
    posted_date: toSerializableJobDate(record.posted_date),
    deadline: toSerializableJobDate(record.deadline),
    created_at: toSerializableJobDate(record.created_at),
    updated_at: toSerializableJobDate(record.updated_at),
  };
}
