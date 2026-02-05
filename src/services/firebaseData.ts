import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { getJobTimestamp } from "@/lib/jobUtils";
import type { Category, Company, Job } from "@/types";

function mapCompany(
  id: string,
  data: Partial<Company> | undefined,
): Company {
  return {
    id,
    name: data?.name?.trim() || "Unknown Company",
    logo_url: data?.logo_url,
    website: data?.website,
    email: data?.email,
    phone: data?.phone,
    location: data?.location,
    description: data?.description,
    created_at: data?.created_at ?? null,
    updated_at: data?.updated_at ?? null,
  };
}

function mapCategory(
  id: string,
  data: Partial<Category> | undefined,
): Category {
  return {
    id,
    name: data?.name?.trim() || "General",
    slug: data?.slug,
    description: data?.description,
    created_at: data?.created_at ?? null,
    updated_at: data?.updated_at ?? null,
  };
}

function mapJob(id: string, data: Partial<Job> | undefined): Job {
  return {
    id,
    title: data?.title?.trim() || "Untitled Job",
    description: data?.description,
    requirements: data?.requirements,
    responsibilities: data?.responsibilities,
    benefits: data?.benefits,
    skills: data?.skills,
    location: data?.location,
    job_type: data?.job_type,
    employment_type: data?.employment_type,
    work_mode: data?.work_mode,
    salary_text: data?.salary_text,
    salary_currency: data?.salary_currency,
    salary_min: data?.salary_min ?? null,
    salary_max: data?.salary_max ?? null,
    apply_url: data?.apply_url,
    is_active: data?.is_active ?? true,
    is_featured: data?.is_featured ?? false,
    applied_count: data?.applied_count ?? 0,
    category_id: data?.category_id,
    company_id: data?.company_id,
    company: data?.company,
    category: data?.category,
    posted_date: data?.posted_date ?? null,
    deadline: data?.deadline ?? null,
    created_at: data?.created_at ?? null,
    updated_at: data?.updated_at ?? null,
  };
}

export async function getCompanies(): Promise<Company[]> {
  if (!db) {
    return [];
  }

  try {
    const companiesRef = collection(db, "companies");
    const snapshot = await getDocs(query(companiesRef, orderBy("name", "asc")));

    return snapshot.docs.map((companyDoc) =>
      mapCompany(companyDoc.id, companyDoc.data() as Partial<Company>),
    );
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!db) {
    return [];
  }

  try {
    const categoriesRef = collection(db, "categories");
    const snapshot = await getDocs(query(categoriesRef, orderBy("name", "asc")));

    return snapshot.docs.map((categoryDoc) =>
      mapCategory(categoryDoc.id, categoryDoc.data() as Partial<Category>),
    );
  } catch {
    return [];
  }
}

export async function getJobs(): Promise<Job[]> {
  if (!db) {
    return [];
  }

  const jobsRef = collection(db, "jobs");

  try {
    const activeJobsQuery = query(
      jobsRef,
      where("is_active", "==", true),
      orderBy("posted_date", "desc"),
    );

    const snapshot = await getDocs(activeJobsQuery);
    return snapshot.docs
      .map((jobDoc) => mapJob(jobDoc.id, jobDoc.data() as Partial<Job>))
      .sort((a, b) => getJobTimestamp(b.posted_date ?? null) - getJobTimestamp(a.posted_date ?? null));
  } catch {
    const fallbackSnapshot = await getDocs(jobsRef);
    return fallbackSnapshot.docs
      .map((jobDoc) => mapJob(jobDoc.id, jobDoc.data() as Partial<Job>))
      .filter((job) => job.is_active !== false)
      .sort((a, b) => getJobTimestamp(b.posted_date ?? null) - getJobTimestamp(a.posted_date ?? null));
  }
}

export async function registerVisitor(): Promise<number> {
  if (!db) {
    return 0;
  }

  const visitorsRef = doc(db, "stats", "visitors");

  try {
    await setDoc(
      visitorsRef,
      {
        count: increment(1),
        updated_at: serverTimestamp(),
      },
      { merge: true },
    );

    const updatedSnapshot = await getDoc(visitorsRef);
    const data = updatedSnapshot.data();
    return typeof data?.count === "number" ? data.count : 0;
  } catch {
    return getVisitorCount();
  }
}

export async function getVisitorCount(): Promise<number> {
  if (!db) {
    return 0;
  }

  try {
    const snapshot = await getDoc(doc(db, "stats", "visitors"));
    const data = snapshot.data();
    return typeof data?.count === "number" ? data.count : 0;
  } catch {
    return 0;
  }
}

export async function incrementJobAppliedCount(jobId: string): Promise<void> {
  if (!db || !jobId) {
    return;
  }

  try {
    const jobRef = doc(db, "jobs", jobId);
    await updateDoc(jobRef, {
      applied_count: increment(1),
      updated_at: serverTimestamp(),
    });
  } catch {
    // no-op so UI remains responsive even if analytics update fails
  }
}
