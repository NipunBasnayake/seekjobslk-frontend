import "server-only";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import type { Job } from "@/types";
import { adminDb } from "@/lib/firebaseAdmin";
import { db as serverDb } from "@/lib/firebaseServer";
import { normalizeMultilineValues } from "@/lib/normalize";
import { toIsoString } from "@/lib/jobUtils";

const mapJob = (id: string, raw: any): Job => ({
  id,
  title: raw?.title ?? "Untitled Job",

  company:
    raw?.company ??
    (raw?.companyId
      ? { id: raw.companyId, name: "Unknown Company", logo_url: "", location: "" }
      : { id: "unknown", name: "Unknown Company", logo_url: "", location: "" }),
  category:
    raw?.category ??
    (raw?.categoryId
      ? { id: raw.categoryId, name: "General" }
      : { id: "general", name: "General" }),

  companyId: raw?.companyId,
  categoryId: raw?.categoryId,

  job_type: raw?.job_type ?? "Full-Time",
  salary: raw?.salary ?? "Negotiable",
  location: raw?.location ?? "Sri Lanka",

  description: raw?.description ?? "",
  requirements: normalizeMultilineValues(raw?.requirements),
  apply_url: raw?.apply_url ?? "#",
  status: raw?.status ?? "Active",
  is_featured: Boolean(raw?.is_featured),
  posted_date: toIsoString(raw?.posted_date),
  applied_count: Number(raw?.applied_count) || 0,
});

export const getJobsServer = async (): Promise<Job[]> => {
  if (adminDb) {
    const snapshot = await adminDb.collection("jobs").get();
    return snapshot.docs.map((docSnap) => mapJob(docSnap.id, docSnap.data()));
  }

  const snapshot = await getDocs(collection(serverDb, "jobs"));
  return snapshot.docs.map((docSnap) => mapJob(docSnap.id, docSnap.data()));
};

export const getActiveJobsServer = async (): Promise<Job[]> => {
  if (adminDb) {
    const snapshot = await adminDb.collection("jobs").get();
    return snapshot.docs
      .map((docSnap) => mapJob(docSnap.id, docSnap.data()))
      .filter((job) => job.status === "Active");
  }

  const snapshot = await getDocs(collection(serverDb, "jobs"));
  return snapshot.docs
    .map((docSnap) => mapJob(docSnap.id, docSnap.data()))
    .filter((job) => job.status === "Active");
};

export const getJobByIdServer = async (jobId: string): Promise<Job | null> => {
  if (!jobId) return null;

  if (adminDb) {
    const docSnap = await adminDb.collection("jobs").doc(jobId).get();
    if (!docSnap.exists) return null;
    return mapJob(docSnap.id, docSnap.data());
  }

  const docSnap = await getDoc(doc(serverDb, "jobs", jobId));
  if (!docSnap.exists()) return null;
  return mapJob(docSnap.id, docSnap.data());
};
