"use client";

import type { Category, Company } from "@/types";
import type { JobFilterState } from "@/components/homeTypes";

interface FilterSectionProps {
  categories: Category[];
  companies: Company[];
  jobTypes: string[];
  locations: string[];
  value: JobFilterState;
  onChange: (value: JobFilterState) => void;
  onReset: () => void;
}

export function FilterSection({
  categories,
  companies,
  jobTypes,
  locations,
  value,
  onChange,
  onReset,
}: FilterSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">Filter Jobs</h2>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
        >
          Reset filters
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Search</span>
          <input
            type="text"
            value={value.search}
            onChange={(event) =>
              onChange({
                ...value,
                search: event.target.value,
              })
            }
            placeholder="Search jobs, companies, keywords"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Category</span>
          <select
            value={value.categoryId}
            onChange={(event) =>
              onChange({
                ...value,
                categoryId: event.target.value,
              })
            }
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Company</span>
          <select
            value={value.companyId}
            onChange={(event) =>
              onChange({
                ...value,
                companyId: event.target.value,
              })
            }
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
          >
            <option value="">All companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Job Type</span>
          <select
            value={value.jobType}
            onChange={(event) =>
              onChange({
                ...value,
                jobType: event.target.value,
              })
            }
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
          >
            <option value="">All types</option>
            {jobTypes.map((jobType) => (
              <option key={jobType} value={jobType}>
                {jobType}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Location</span>
          <select
            value={value.location}
            onChange={(event) =>
              onChange({
                ...value,
                location: event.target.value,
              })
            }
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Min Salary</span>
            <input
              type="number"
              min={0}
              value={value.salaryMin}
              onChange={(event) =>
                onChange({
                  ...value,
                  salaryMin: event.target.value,
                })
              }
              placeholder="0"
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Max Salary</span>
            <input
              type="number"
              min={0}
              value={value.salaryMax}
              onChange={(event) =>
                onChange({
                  ...value,
                  salaryMax: event.target.value,
                })
              }
              placeholder="Any"
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
