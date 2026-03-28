"use client";

import { SelectField, type SelectOption } from "@/components/ui/select-field";
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
  const categoryOptions: SelectOption[] = [
    { label: "All categories", value: "" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];

  const companyOptions: SelectOption[] = [
    { label: "All companies", value: "" },
    ...companies.map((company) => ({
      label: company.name,
      value: company.id,
    })),
  ];

  const jobTypeOptions: SelectOption[] = [
    { label: "All types", value: "" },
    ...jobTypes.map((jobType) => ({
      label: jobType,
      value: jobType,
    })),
  ];

  const locationOptions: SelectOption[] = [
    { label: "All locations", value: "" },
    ...locations.map((location) => ({
      label: location,
      value: location,
    })),
  ];

  const sortOptions: SelectOption[] = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Salary: High to Low", value: "salary-desc" },
    { label: "Salary: Low to High", value: "salary-asc" },
    { label: "Most Applied", value: "popular" },
  ];

  return (
    <section className="ui-card p-5 sm:p-6" aria-labelledby="filters-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 id="filters-title" className="ui-section-title">
            Filter Jobs
          </h2>
          <p className="ui-section-subtitle">Refine results without leaving the page.</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="ui-button ui-button-ghost min-h-10 px-3.5 text-xs"
        >
          Reset filters
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="ui-field col-span-full">
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
            aria-label="Search jobs"
            autoComplete="off"
          />
          <span className="ui-helper">Search by title, company, or relevant keywords.</span>
        </div>

        <div className="ui-field">
          <span className="ui-label">Category</span>
          <SelectField
            value={value.categoryId}
            placeholder="All categories"
            options={categoryOptions}
            ariaLabel="Filter by category"
            onChange={(categoryId) =>
              onChange({
                ...value,
                categoryId,
              })
            }
          />
        </div>

        <div className="ui-field">
          <span className="ui-label">Company</span>
          <SelectField
            value={value.companyId}
            placeholder="All companies"
            options={companyOptions}
            ariaLabel="Filter by company"
            onChange={(companyId) =>
              onChange({
                ...value,
                companyId,
              })
            }
          />
        </div>

        <div className="ui-field">
          <span className="ui-label">Job Type</span>
          <SelectField
            value={value.jobType}
            placeholder="All types"
            options={jobTypeOptions}
            ariaLabel="Filter by job type"
            onChange={(jobType) =>
              onChange({
                ...value,
                jobType,
              })
            }
          />
        </div>

        <div className="ui-field">
          <span className="ui-label">Location</span>
          <SelectField
            value={value.location}
            placeholder="All locations"
            options={locationOptions}
            ariaLabel="Filter by location"
            onChange={(location) =>
              onChange({
                ...value,
                location,
              })
            }
          />
        </div>

        <div className="ui-field">
          <span className="ui-label">Sort By</span>
          <SelectField
            value={value.sortBy}
            placeholder="Newest First"
            options={sortOptions}
            ariaLabel="Sort jobs"
            onChange={(sortBy) =>
              onChange({
                ...value,
                sortBy,
              })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="ui-field">
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
              aria-label="Minimum salary"
              inputMode="numeric"
            />
          </div>
          <div className="ui-field">
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
              aria-label="Maximum salary"
              inputMode="numeric"
            />
          </div>
        </div>

        <p className="ui-helper col-span-full">
          Salary filters are optional and work best with your preferred monthly range.
        </p>
      </div>
    </section>
  );
}
