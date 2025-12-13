import { collection, getDocs, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Company, Category, Job } from "@/types/index";

const normalizeMultiline = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map(v => String(v).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map(v => v.trim())
      .filter(Boolean);
  }

  return [];
};

const mapCompany = (id: string, data: any): Company => ({
  id,
  name: typeof data?.name === "string" ? data.name : "Unknown Company",
  logo_url: typeof data?.logo_url === "string" ? data.logo_url : "",
  location: typeof data?.location === "string" ? data.location : "",
  website: typeof data?.website === "string" ? data.website : undefined,
});

const mapCategory = (id: string, data: any): Category => ({
  id,
  name: typeof data?.name === "string" ? data.name : "General",
});

const mapJob = (id: string, raw: any): Job => ({
  id,
  title: raw?.title ?? "Untitled Job",
  company: raw?.company,
  category: raw?.category,
  job_type: raw?.job_type ?? "Full-Time",
  salary: raw?.salary ?? "Negotiable",
  location: raw?.location ?? "Sri Lanka",
  description: raw?.description ?? "",
  requirements: normalizeMultiline(raw?.requirements),
  apply_url: raw?.apply_url ?? "#",
  status: raw?.status ?? "Active",
  is_featured: Boolean(raw?.is_featured),
  posted_date:
    raw?.posted_date instanceof Timestamp
      ? raw.posted_date
      : Timestamp.fromDate(new Date()),
  applied_count: Number(raw?.applied_count) || 0,
});

export const getCompanies = async (): Promise<Company[]> => {
  const snapshot = await getDocs(collection(db, "companies"));
  return snapshot.docs.map((d) => mapCompany(d.id, d.data()));
};

export const getCategories = async (): Promise<Category[]> => {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map((d) => mapCategory(d.id, d.data()));
};

export const getJobs = async (): Promise<Job[]> => {
  const snapshot = await getDocs(collection(db, "jobs"));
  return snapshot.docs.map((d) => mapJob(d.id, d.data()));
};

export const getJobById = async (jobId: string): Promise<Job | null> => {
  if (!jobId) return null;

  const snap = await getDoc(doc(db, "jobs", jobId));
  if (!snap.exists()) return null;

  return mapJob(snap.id, snap.data());
};
