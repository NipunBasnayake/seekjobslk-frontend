"use client";

import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import type { JobFilterState } from "@/components/homeTypes";
import { countActiveFilters } from "@/lib/jobFiltering";
import type { Category, Company } from "@/types";

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
  const [expanded, setExpanded] = useState(false);

  const categoryOptions: SelectOption[] = useMemo(
    () => [
      { label: "All categories", value: "" },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ],
    [categories],
  );

  const companyOptions: SelectOption[] = useMemo(
    () => [
      { label: "All companies", value: "" },
      ...companies.map((company) => ({
        label: company.name,
        value: company.id,
      })),
    ],
    [companies],
  );

  const jobTypeOptions: SelectOption[] = useMemo(
    () => [
      { label: "All types", value: "" },
      ...jobTypes.map((jobType) => ({
        label: jobType,
        value: jobType,
      })),
    ],
    [jobTypes],
  );

  const locationOptions: SelectOption[] = useMemo(
    () => [
      { label: "All locations", value: "" },
      ...locations.map((location) => ({
        label: location,
        value: location,
      })),
    ],
    [locations],
  );

  const sortOptions: SelectOption[] = [
    { label: "Newest first", value: "newest" },
    { label: "Oldest first", value: "oldest" },
    { label: "Salary: high to low", value: "salary-desc" },
    { label: "Salary: low to high", value: "salary-asc" },
    { label: "Most applied", value: "popular" },
  ];

  const activeFilterCount = useMemo(() => {
    return countActiveFilters(value);
  }, [value]);

  return (
    <section className="ui-card p-5 sm:p-6" aria-labelledby="filters-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 id="filters-title" className="ui-section-title">
            Filter Jobs
          </h2>
          <p className="ui-section-subtitle">
            Narrow down results by skills, company, salary, and location.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 ? (
            <span className="ui-pill">{activeFilterCount} active</span>
          ) : null}

          <button
            type="button"
            className="ui-button ui-button-secondary min-h-10 px-3.5 text-sm"
            aria-expanded={expanded}
            aria-controls="job-filters-panel"
            onClick={() => setExpanded((state) => !state)}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {expanded ? "Hide filters" : "Show filters"}
            <ChevronDown
              className={[
                "h-4 w-4 transition-transform duration-200",
                expanded ? "rotate-180" : "",
              ].join(" ")}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div
        id="job-filters-panel"
        className={[
          "grid transition-all duration-200",
          expanded ? "mt-5 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid gap-4 border-t border-border/70 pt-5 sm:grid-cols-2 lg:grid-cols-3">
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
                placeholder="Search jobs, companies, or keywords"
                className="ui-input"
                aria-label="Search jobs"
                autoComplete="off"
              />
              <span className="ui-helper">Search by title, skills, company, or location.</span>
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
                placeholder="Newest first"
                options={sortOptions}
                ariaLabel="Sort jobs"
                onChange={(sortBy) =>
                  onChange({
                    ...value,
                    sortBy: sortBy as JobFilterState["sortBy"],
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
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

            <div className="col-span-full flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
              <p className="ui-helper m-0">
                Salary filters are optional and compare against the job salary range.
              </p>
              <button
                type="button"
                onClick={onReset}
                className="ui-button ui-button-ghost min-h-10 px-3.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
