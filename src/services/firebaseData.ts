import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Company, Category, Job } from "@/types/index";

const normalizeMultiline = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((v) => v.trim())
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

  company: raw?.company ?? (raw?.companyId ? { id: raw.companyId, name: "Unknown Company", logo_url: "", location: "" } : undefined),
  category: raw?.category ?? (raw?.categoryId ? { id: raw.categoryId, name: "General" } : undefined),

  companyId: raw?.companyId,
  categoryId: raw?.categoryId,

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

const VISITOR_DOC = doc(db, "stats", "visitors");
const SESSION_KEY = "seekjobslk-visitor-counted";

export const registerVisitor = async (): Promise<number> => {
  if (sessionStorage.getItem(SESSION_KEY)) {
    const snap = await getDoc(VISITOR_DOC);
    return snap.exists() ? snap.data().count : 0;
  }

  const snap = await getDoc(VISITOR_DOC);

  if (!snap.exists()) {
    await setDoc(VISITOR_DOC, { count: 1 });
    sessionStorage.setItem(SESSION_KEY, "true");
    return 1;
  }

  await updateDoc(VISITOR_DOC, { count: increment(1) });
  sessionStorage.setItem(SESSION_KEY, "true");

  const updatedSnap = await getDoc(VISITOR_DOC);
  return updatedSnap.data().count;
};

export const getVisitorCount = async (): Promise<number> => {
  const snap = await getDoc(VISITOR_DOC);
  return snap.exists() ? snap.data().count : 0;
};

export const incrementJobAppliedCount = async (jobId: string): Promise<void> => {
  if (!jobId) return;
  const jobRef = doc(db, "jobs", jobId);
  await updateDoc(jobRef, { applied_count: increment(1) });
};
