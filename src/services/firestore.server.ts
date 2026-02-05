import "server-only";

import {
  collection,
  type DocumentData,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  type Query,
  where,
} from "firebase/firestore";
import { firebaseServerDb } from "@/lib/firebaseServer";
import { getJobDate, getJobTimestamp } from "@/lib/jobUtils";
import type { Category, Company, Job, JobDate } from "@/types";

function toSerializableJobDate(value: unknown): JobDate {
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
    const maybeSeconds = (value as { seconds?: unknown }).seconds;
    const maybeNanoseconds = (value as { nanoseconds?: unknown }).nanoseconds;

    if (typeof maybeSeconds === "number") {
      return {
        seconds: maybeSeconds,
        nanoseconds: typeof maybeNanoseconds === "number" ? maybeNanoseconds : 0,
      };
    }
  }

  return null;
}

function mapEmbeddedCompany(data: unknown): Company | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const raw = data as Partial<Company> & { id?: string };

  return {
    id: typeof raw.id === "string" ? raw.id : "",
    name: raw.name?.trim() || "Unknown Company",
    logo_url: raw.logo_url,
    website: raw.website,
    email: raw.email,
    phone: raw.phone,
    location: raw.location,
    description: raw.description,
    created_at: toSerializableJobDate(raw.created_at),
    updated_at: toSerializableJobDate(raw.updated_at),
  };
}

function mapEmbeddedCategory(data: unknown): Category | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const raw = data as Partial<Category> & { id?: string };

  return {
    id: typeof raw.id === "string" ? raw.id : "",
    name: raw.name?.trim() || "General",
    slug: raw.slug,
    description: raw.description,
    created_at: toSerializableJobDate(raw.created_at),
    updated_at: toSerializableJobDate(raw.updated_at),
  };
}

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
    created_at: toSerializableJobDate(data?.created_at),
    updated_at: toSerializableJobDate(data?.updated_at),
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
    created_at: toSerializableJobDate(data?.created_at),
    updated_at: toSerializableJobDate(data?.updated_at),
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
    company: mapEmbeddedCompany(data?.company),
    category: mapEmbeddedCategory(data?.category),
    posted_date: toSerializableJobDate(data?.posted_date),
    deadline: toSerializableJobDate(data?.deadline),
    created_at: toSerializableJobDate(data?.created_at),
    updated_at: toSerializableJobDate(data?.updated_at),
  };
}

async function getCompanyById(companyId?: string): Promise<Company | undefined> {
  if (!firebaseServerDb || !companyId) {
    return undefined;
  }

  try {
    const snapshot = await getDoc(doc(firebaseServerDb, "companies", companyId));
    if (!snapshot.exists()) {
      return undefined;
    }

    return mapCompany(snapshot.id, snapshot.data() as Partial<Company>);
  } catch {
    return undefined;
  }
}

async function getCategoryById(categoryId?: string): Promise<Category | undefined> {
  if (!firebaseServerDb || !categoryId) {
    return undefined;
  }

  try {
    const snapshot = await getDoc(doc(firebaseServerDb, "categories", categoryId));
    if (!snapshot.exists()) {
      return undefined;
    }

    return mapCategory(snapshot.id, snapshot.data() as Partial<Category>);
  } catch {
    return undefined;
  }
}

async function hydrateJobs(jobs: Job[]): Promise<Job[]> {
  const companyCache = new Map<string, Company | undefined>();
  const categoryCache = new Map<string, Category | undefined>();

  return Promise.all(
    jobs.map(async (job) => {
      const companyId = job.company_id;
      const categoryId = job.category_id;

      let company = job.company;
      let category = job.category;

      if (!company && companyId) {
        if (!companyCache.has(companyId)) {
          companyCache.set(companyId, await getCompanyById(companyId));
        }
        company = companyCache.get(companyId);
      }

      if (!category && categoryId) {
        if (!categoryCache.has(categoryId)) {
          categoryCache.set(categoryId, await getCategoryById(categoryId));
        }
        category = categoryCache.get(categoryId);
      }

      return {
        ...job,
        company,
        category,
      };
    }),
  );
}

export async function getJobsServer(): Promise<Job[]> {
  if (!firebaseServerDb) {
    return [];
  }

  const jobsRef = collection(firebaseServerDb, "jobs");

  try {
    const snapshot = await getDocs(query(jobsRef, orderBy("posted_date", "desc")));
    const jobs = snapshot.docs.map((jobDoc) =>
      mapJob(jobDoc.id, jobDoc.data() as Partial<Job>),
    );

    return hydrateJobs(jobs.sort((a, b) => getJobTimestamp(b.posted_date ?? null) - getJobTimestamp(a.posted_date ?? null)));
  } catch {
    const snapshot = await getDocs(jobsRef);
    const jobs = snapshot.docs.map((jobDoc) =>
      mapJob(jobDoc.id, jobDoc.data() as Partial<Job>),
    );

    const sortedJobs = jobs.sort(
      (a, b) =>
        getJobTimestamp(b.posted_date ?? null) -
        getJobTimestamp(a.posted_date ?? null),
    );

    return hydrateJobs(sortedJobs);
  }
}

export async function getActiveJobsServer(): Promise<Job[]> {
  if (!firebaseServerDb) {
    return [];
  }

  const jobsRef = collection(firebaseServerDb, "jobs");

  try {
    const activeQuery = query(
      jobsRef,
      where("is_active", "==", true),
      orderBy("posted_date", "desc"),
    );

    const snapshot = await getDocs(activeQuery);
    const jobs = snapshot.docs
      .map((jobDoc) => mapJob(jobDoc.id, jobDoc.data() as Partial<Job>))
      .sort(
        (a, b) =>
          getJobTimestamp(b.posted_date ?? null) -
          getJobTimestamp(a.posted_date ?? null),
      );

    return hydrateJobs(jobs);
  } catch {
    const jobs = await getJobsServer();
    return jobs.filter((job) => job.is_active !== false);
  }
}

export async function getJobByIdServer(jobId: string): Promise<Job | null> {
  if (!firebaseServerDb || !jobId) {
    return null;
  }

  try {
    const jobSnapshot = await getDoc(doc(firebaseServerDb, "jobs", jobId));
    if (!jobSnapshot.exists()) {
      return null;
    }

    const job = mapJob(jobSnapshot.id, jobSnapshot.data() as Partial<Job>);
    const [company, category] = await Promise.all([
      job.company ?? getCompanyById(job.company_id),
      job.category ?? getCategoryById(job.category_id),
    ]);

    return {
      ...job,
      company,
      category,
    };
  } catch {
    return null;
  }
}

interface RelatedJobOptions {
  days?: number;
  limit?: number;
}

export async function getRelatedJobsServer(
  job: Job,
  options: RelatedJobOptions = {},
): Promise<Job[]> {
  const days = options.days ?? 30;
  const maxItems = options.limit ?? 6;

  if (!firebaseServerDb || maxItems <= 0) {
    return [];
  }

  const thresholdDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const jobsRef = collection(firebaseServerDb, "jobs");

  try {
    let relatedQuery: Query<DocumentData>;

    if (job.category_id) {
      relatedQuery = query(
        jobsRef,
        where("is_active", "==", true),
        where("category_id", "==", job.category_id),
        where("posted_date", ">=", thresholdDate),
        orderBy("posted_date", "desc"),
        limit(maxItems + 2),
      );
    } else if (job.company_id) {
      relatedQuery = query(
        jobsRef,
        where("is_active", "==", true),
        where("company_id", "==", job.company_id),
        where("posted_date", ">=", thresholdDate),
        orderBy("posted_date", "desc"),
        limit(maxItems + 2),
      );
    } else {
      relatedQuery = query(
        jobsRef,
        where("is_active", "==", true),
        where("posted_date", ">=", thresholdDate),
        orderBy("posted_date", "desc"),
        limit(maxItems + 2),
      );
    }

    const snapshot = await getDocs(relatedQuery);
    const jobs = snapshot.docs
      .map((jobDoc) => mapJob(jobDoc.id, jobDoc.data() as Partial<Job>))
      .filter((item) => item.id !== job.id)
      .sort(
        (a, b) =>
          getJobTimestamp(b.posted_date ?? null) -
          getJobTimestamp(a.posted_date ?? null),
      )
      .slice(0, maxItems);

    return hydrateJobs(jobs);
  } catch {
    const activeJobs = await getActiveJobsServer();
    const related = activeJobs
      .filter((item) => item.id !== job.id)
      .filter((item) => {
        const postedDate = getJobDate(item.posted_date ?? null);
        const isRecent = postedDate ? postedDate >= thresholdDate : false;

        if (job.category_id && item.category_id) {
          return item.category_id === job.category_id && isRecent;
        }

        if (job.company_id && item.company_id) {
          return item.company_id === job.company_id && isRecent;
        }

        return isRecent;
      })
      .slice(0, maxItems);

    return related;
  }
}
