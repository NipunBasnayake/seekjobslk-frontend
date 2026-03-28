import { getJobTimestamp } from "@/lib/jobUtils";
import type { JobFilterState } from "@/components/homeTypes";
import type { Job } from "@/types";

export function filterAndSortJobs(jobs: Job[], filters: JobFilterState): Job[] {
  const searchText = filters.search.trim().toLowerCase();
  const salaryMin = Number(filters.salaryMin || 0);
  const salaryMax = Number(filters.salaryMax || 0);

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !searchText ||
      job.title.toLowerCase().includes(searchText) ||
      (job.description || "").toLowerCase().includes(searchText) ||
      (job.company?.name || "").toLowerCase().includes(searchText) ||
      (job.location || "").toLowerCase().includes(searchText);

    const matchesCategory = !filters.categoryId || job.category_id === filters.categoryId;
    const matchesCompany = !filters.companyId || job.company_id === filters.companyId;
    const matchesType = !filters.jobType || job.job_type === filters.jobType;
    const matchesLocation = !filters.location || job.location === filters.location;

    const jobMin = typeof job.salary_min === "number" ? job.salary_min : 0;
    const jobMax = typeof job.salary_max === "number" ? job.salary_max : Number.MAX_SAFE_INTEGER;
    const matchesSalaryMin = salaryMin <= 0 || jobMax >= salaryMin;
    const matchesSalaryMax = salaryMax <= 0 || jobMin <= salaryMax;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesCompany &&
      matchesType &&
      matchesLocation &&
      matchesSalaryMin &&
      matchesSalaryMax
    );
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case "oldest":
        return getJobTimestamp(a.posted_date ?? null) - getJobTimestamp(b.posted_date ?? null);
      case "salary-desc":
        return (b.salary_max ?? 0) - (a.salary_max ?? 0);
      case "salary-asc":
        return (a.salary_min ?? 0) - (b.salary_min ?? 0);
      case "popular":
        return (b.applied_count ?? 0) - (a.applied_count ?? 0);
      case "newest":
      default:
        return getJobTimestamp(b.posted_date ?? null) - getJobTimestamp(a.posted_date ?? null);
    }
  });
}

export function countActiveFilters(filters: JobFilterState): number {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.categoryId) count += 1;
  if (filters.companyId) count += 1;
  if (filters.jobType) count += 1;
  if (filters.location) count += 1;
  if (filters.salaryMin.trim()) count += 1;
  if (filters.salaryMax.trim()) count += 1;
  if (filters.sortBy !== "newest") count += 1;
  return count;
}
