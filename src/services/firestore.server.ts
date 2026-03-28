import "server-only";

import { unstable_cache } from "next/cache";
import type { Query as AdminQuery } from "firebase-admin/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { mapCategory, mapCompany, mapJob } from "@/lib/jobMapper";
import { getJobDate, getJobTimestamp } from "@/lib/jobUtils";
import { firebaseServerDb } from "@/lib/firebaseServer";
import type { Category, Company, Job } from "@/types";

const JOBS_REVALIDATE_SECONDS = 120;
const LOOKUPS_REVALIDATE_SECONDS = 600;

function getDatabases() {
  return {
    adminDb: getFirebaseAdminDb(),
    clientDb: firebaseServerDb,
  };
}

async function fetchCompaniesDirect(): Promise<Company[]> {
  const { adminDb, clientDb } = getDatabases();

  if (adminDb) {
    try {
      const snapshot = await adminDb.collection("companies").orderBy("name", "asc").get();
      return snapshot.docs.map((companyDoc) => mapCompany(companyDoc.id, companyDoc.data()));
    } catch {
      return [];
    }
  }

  if (clientDb) {
    try {
      const companiesRef = collection(clientDb, "companies");
      const snapshot = await getDocs(query(companiesRef, orderBy("name", "asc")));
      return snapshot.docs.map((companyDoc) => mapCompany(companyDoc.id, companyDoc.data()));
    } catch {
      return [];
    }
  }

  return [];
}

async function fetchCategoriesDirect(): Promise<Category[]> {
  const { adminDb, clientDb } = getDatabases();

  if (adminDb) {
    try {
      const snapshot = await adminDb.collection("categories").orderBy("name", "asc").get();
      return snapshot.docs.map((categoryDoc) => mapCategory(categoryDoc.id, categoryDoc.data()));
    } catch {
      return [];
    }
  }

  if (clientDb) {
    try {
      const categoriesRef = collection(clientDb, "categories");
      const snapshot = await getDocs(query(categoriesRef, orderBy("name", "asc")));
      return snapshot.docs.map((categoryDoc) => mapCategory(categoryDoc.id, categoryDoc.data()));
    } catch {
      return [];
    }
  }

  return [];
}

async function fetchJobByIdDirect(jobId: string): Promise<Job | null> {
  if (!jobId) {
    return null;
  }

  const { adminDb, clientDb } = getDatabases();

  if (adminDb) {
    try {
      const snapshot = await adminDb.collection("jobs").doc(jobId).get();
      if (!snapshot.exists) {
        return null;
      }

      return mapJob(snapshot.id, snapshot.data());
    } catch {
      return null;
    }
  }

  if (clientDb) {
    try {
      const snapshot = await getDoc(doc(clientDb, "jobs", jobId));
      if (!snapshot.exists()) {
        return null;
      }

      return mapJob(snapshot.id, snapshot.data());
    } catch {
      return null;
    }
  }

  return null;
}

async function fetchCompanyByIdDirect(companyId?: string): Promise<Company | undefined> {
  if (!companyId) {
    return undefined;
  }

  const { adminDb, clientDb } = getDatabases();

  if (adminDb) {
    try {
      const snapshot = await adminDb.collection("companies").doc(companyId).get();
      if (!snapshot.exists) {
        return undefined;
      }

      return mapCompany(snapshot.id, snapshot.data());
    } catch {
      return undefined;
    }
  }

  if (clientDb) {
    try {
      const snapshot = await getDoc(doc(clientDb, "companies", companyId));
      if (!snapshot.exists()) {
        return undefined;
      }

      return mapCompany(snapshot.id, snapshot.data());
    } catch {
      return undefined;
    }
  }

  return undefined;
}

async function fetchCategoryByIdDirect(categoryId?: string): Promise<Category | undefined> {
  if (!categoryId) {
    return undefined;
  }

  const { adminDb, clientDb } = getDatabases();

  if (adminDb) {
    try {
      const snapshot = await adminDb.collection("categories").doc(categoryId).get();
      if (!snapshot.exists) {
        return undefined;
      }

      return mapCategory(snapshot.id, snapshot.data());
    } catch {
      return undefined;
    }
  }

  if (clientDb) {
    try {
      const snapshot = await getDoc(doc(clientDb, "categories", categoryId));
      if (!snapshot.exists()) {
        return undefined;
      }

      return mapCategory(snapshot.id, snapshot.data());
    } catch {
      return undefined;
    }
  }

  return undefined;
}

async function hydrateJobs(jobs: Job[]): Promise<Job[]> {
  const companyCache = new Map<string, Company | undefined>();
  const categoryCache = new Map<string, Category | undefined>();

  return Promise.all(
    jobs.map(async (job) => {
      let company = job.company;
      let category = job.category;

      if (!company && job.company_id) {
        if (!companyCache.has(job.company_id)) {
          companyCache.set(job.company_id, await fetchCompanyByIdDirect(job.company_id));
        }
        company = companyCache.get(job.company_id);
      }

      if (!category && job.category_id) {
        if (!categoryCache.has(job.category_id)) {
          categoryCache.set(job.category_id, await fetchCategoryByIdDirect(job.category_id));
        }
        category = categoryCache.get(job.category_id);
      }

      return {
        ...job,
        company,
        category,
      };
    }),
  );
}

async function fetchJobsDirect(activeOnly: boolean): Promise<Job[]> {
  const { adminDb, clientDb } = getDatabases();
  let jobs: Job[] = [];

  if (adminDb) {
    try {
      let request: AdminQuery = adminDb.collection("jobs");
      if (activeOnly) {
        request = request.where("is_active", "==", true);
      }

      const orderedSnapshot = await request.orderBy("posted_date", "desc").get();
      jobs = orderedSnapshot.docs.map((jobDoc) => mapJob(jobDoc.id, jobDoc.data()));
    } catch {
      try {
        let request: AdminQuery = adminDb.collection("jobs");
        if (activeOnly) {
          request = request.where("is_active", "==", true);
        }

        const fallbackSnapshot = await request.get();
        jobs = fallbackSnapshot.docs.map((jobDoc) => mapJob(jobDoc.id, jobDoc.data()));
      } catch {
        jobs = [];
      }
    }
  } else if (clientDb) {
    const jobsRef = collection(clientDb, "jobs");
    try {
      const orderedQuery = activeOnly
        ? query(jobsRef, where("is_active", "==", true), orderBy("posted_date", "desc"))
        : query(jobsRef, orderBy("posted_date", "desc"));
      const snapshot = await getDocs(orderedQuery);
      jobs = snapshot.docs.map((jobDoc) => mapJob(jobDoc.id, jobDoc.data()));
    } catch {
      const snapshot = await getDocs(jobsRef);
      jobs = snapshot.docs
        .map((jobDoc) => mapJob(jobDoc.id, jobDoc.data()))
        .filter((job) => (activeOnly ? job.is_active !== false : true));
    }
  }

  const sortedJobs = jobs.sort(
    (a, b) => getJobTimestamp(b.posted_date ?? null) - getJobTimestamp(a.posted_date ?? null),
  );

  return hydrateJobs(sortedJobs);
}

const getJobsCached = unstable_cache(
  () => fetchJobsDirect(false),
  ["jobs-all-v2"],
  {
    revalidate: JOBS_REVALIDATE_SECONDS,
    tags: ["jobs"],
  },
);

const getActiveJobsCached = unstable_cache(
  () => fetchJobsDirect(true),
  ["jobs-active-v2"],
  {
    revalidate: JOBS_REVALIDATE_SECONDS,
    tags: ["jobs"],
  },
);

const getCategoriesCached = unstable_cache(
  () => fetchCategoriesDirect(),
  ["categories-v2"],
  {
    revalidate: LOOKUPS_REVALIDATE_SECONDS,
    tags: ["categories"],
  },
);

const getCompaniesCached = unstable_cache(
  () => fetchCompaniesDirect(),
  ["companies-v2"],
  {
    revalidate: LOOKUPS_REVALIDATE_SECONDS,
    tags: ["companies"],
  },
);

export async function getJobsServer(): Promise<Job[]> {
  return getJobsCached();
}

export async function getActiveJobsServer(): Promise<Job[]> {
  return getActiveJobsCached();
}

export async function getCategoriesServer(): Promise<Category[]> {
  return getCategoriesCached();
}

export async function getCompaniesServer(): Promise<Company[]> {
  return getCompaniesCached();
}

export async function getJobByIdServer(jobId: string): Promise<Job | null> {
  const job = await fetchJobByIdDirect(jobId);
  if (!job) {
    return null;
  }

  const [company, category] = await Promise.all([
    job.company ?? fetchCompanyByIdDirect(job.company_id),
    job.category ?? fetchCategoryByIdDirect(job.category_id),
  ]);

  return {
    ...job,
    company,
    category,
  };
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
  const maxItems = Math.max(1, options.limit ?? 6);
  const thresholdDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const activeJobs = await getActiveJobsServer();

  return activeJobs
    .filter((candidate) => candidate.id !== job.id)
    .filter((candidate) => {
      const postedDate = getJobDate(candidate.posted_date ?? null);
      const isRecent = postedDate ? postedDate >= thresholdDate : false;
      if (!isRecent) {
        return false;
      }

      if (job.category_id && candidate.category_id) {
        return candidate.category_id === job.category_id;
      }

      if (job.company_id && candidate.company_id) {
        return candidate.company_id === job.company_id;
      }

      return true;
    })
    .slice(0, maxItems);
}
