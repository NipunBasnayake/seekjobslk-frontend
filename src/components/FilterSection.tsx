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
    <section className="ui-card p-5 sm:p-6" aria-labelledby="filters-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="filters-title" className="ui-section-title">
          Filter Jobs
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="ui-button ui-button-ghost min-h-10 px-3.5 text-xs"
        >
          Reset filters
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="ui-label">Search</span>
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
            className="ui-input"
          />
          <span className="ui-helper">Search by title, company, or relevant keywords.</span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="ui-label">Category</span>
          <select
            value={value.categoryId}
            onChange={(event) =>
              onChange({
                ...value,
                categoryId: event.target.value,
              })
            }
            className="ui-select"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="ui-label">Company</span>
          <select
            value={value.companyId}
            onChange={(event) =>
              onChange({
                ...value,
                companyId: event.target.value,
              })
            }
            className="ui-select"
          >
            <option value="">All companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="ui-label">Job Type</span>
          <select
            value={value.jobType}
            onChange={(event) =>
              onChange({
                ...value,
                jobType: event.target.value,
              })
            }
            className="ui-select"
          >
            <option value="">All types</option>
            {jobTypes.map((jobType) => (
              <option key={jobType} value={jobType}>
                {jobType}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="ui-label">Location</span>
          <select
            value={value.location}
            onChange={(event) =>
              onChange({
                ...value,
                location: event.target.value,
              })
            }
            className="ui-select"
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-2">
            <span className="ui-label">Min Salary</span>
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
              className="ui-input"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="ui-label">Max Salary</span>
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
              className="ui-input"
            />
          </label>
        </div>

        <p className="ui-helper col-span-full">
          Salary filters are optional and work best with your preferred monthly range.
        </p>
      </div>
    </section>
  );
}
