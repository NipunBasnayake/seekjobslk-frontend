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
  where,
} from "firebase/firestore";
import { mapCategory, mapCompany, mapJob } from "@/lib/jobMapper";
import { getJobTimestamp } from "@/lib/jobUtils";
import { db } from "@/lib/firebaseClient";
import type { Category, Company, Job } from "@/types";

export async function getCompanies(): Promise<Company[]> {
  if (!db) {
    return [];
  }

  try {
    const companiesRef = collection(db, "companies");
    const snapshot = await getDocs(query(companiesRef, orderBy("name", "asc")));
    return snapshot.docs.map((companyDoc) => mapCompany(companyDoc.id, companyDoc.data()));
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
    return snapshot.docs.map((categoryDoc) => mapCategory(categoryDoc.id, categoryDoc.data()));
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
      .map((jobDoc) => mapJob(jobDoc.id, jobDoc.data()))
      .sort((a, b) => getJobTimestamp(b.posted_date ?? null) - getJobTimestamp(a.posted_date ?? null));
  } catch {
    const fallbackSnapshot = await getDocs(jobsRef);
    return fallbackSnapshot.docs
      .map((jobDoc) => mapJob(jobDoc.id, jobDoc.data()))
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
