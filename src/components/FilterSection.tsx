import React, { useState, useEffect, useCallback } from "react";
import {
  Filter,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { getCategories, getCompanies } from "@/services/firebaseData";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

import { Category, Company } from "@/types/index";

export interface FilterState {
  categories: string[];
  companies: string[];
  jobTypes: string[];
  salaryRange: [number, number];
  location: string;
}

interface FilterSectionProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"];
const LOCATIONS = ["Colombo", "Kandy", "Galle", "Negombo", "Jaffna", "Remote"];
const DEFAULT_SALARY: [number, number] = [0, 500000];

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFilterChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Fetch categories + companies
  useEffect(() => {
    const fetchData = async () => {
      const [cats, comps] = await Promise.all([
        getCategories(),
        getCompanies(),
      ]);

      setCategories(cats);
      setCompanies(comps);
    };

    fetchData();
  }, []);

  // Generic toggle handler for checkbox-like filters
  const toggleValue = useCallback(
    (key: keyof FilterState, value: string) => {
      const list = filters[key] as string[];
      const updated = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];

      onFilterChange({ ...filters, [key]: updated });
    },
    [filters, onFilterChange]
  );

  // Handlers
  const handleLocationChange = (location: string) =>
    onFilterChange({ ...filters, location });

  const handleSalaryChange = (value: number[]) =>
    onFilterChange({ ...filters, salaryRange: [value[0], value[1]] });

  const clearFilters = () =>
    onFilterChange({
      categories: [],
      companies: [],
      jobTypes: [],
      salaryRange: DEFAULT_SALARY,
      location: "all",
    });

  // Active filter count
  const activeFiltersCount =
    filters.categories.length +
    filters.companies.length +
    filters.jobTypes.length +
    (filters.location && filters.location !== "all" ? 1 : 0) +
    (filters.salaryRange[0] !== DEFAULT_SALARY[0] ||
    filters.salaryRange[1] !== DEFAULT_SALARY[1]
      ? 1
      : 0);

  // Hide location when ONLY "Remote" is selected
  const showLocation =
    !filters.jobTypes.includes("Remote") || filters.jobTypes.length > 1;

  return (
    <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden transition-all duration-300">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-heading">Filter Jobs</h3>
            <p className="text-sm text-muted-foreground">
              {activeFiltersCount > 0
                ? `${activeFiltersCount} filters applied`
                : "Find your perfect job"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-6 animate-slide-up">
          {/* Categories */}
          <FilterBlock icon={Briefcase} label="Categories">
            {categories.map((c) => (
              <Badge
                key={c.id}
                variant={
                  filters.categories.includes(c.id) ? "default" : "outline"
                }
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleValue("categories", c.id)}
              >
                {c.name}
              </Badge>
            ))}
          </FilterBlock>

          {/* Companies */}
          <FilterBlock icon={Building2} label="Companies">
            {companies.map((comp) => (
              <Badge
                key={comp.id}
                variant={
                  filters.companies.includes(comp.id) ? "default" : "outline"
                }
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleValue("companies", comp.id)}
              >
                <img
                  src={comp.logo_url}
                  alt=""
                  className="w-4 h-4 rounded-full mr-1"
                />
                {comp.name}
              </Badge>
            ))}
          </FilterBlock>

          {/* Job Types */}
          <FilterBlock icon={Briefcase} label="Job Type">
            {JOB_TYPES.map((type) => (
              <Badge
                key={type}
                variant={
                  filters.jobTypes.includes(type) ? "default" : "outline"
                }
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleValue("jobTypes", type)}
              >
                {type}
              </Badge>
            ))}
          </FilterBlock>

          {/* Location */}
          {showLocation && (
            <FilterBlock icon={MapPin} label="Location">
              <Select value={filters.location} onValueChange={handleLocationChange}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Locations</SelectItem>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBlock>
          )}

          {/* Salary */}
          <FilterBlock icon={DollarSign} label="Salary Range (LKR)">
            <div className="px-2">
              <Slider
                value={filters.salaryRange}
                min={0}
                max={500000}
                step={10000}
                onValueChange={handleSalaryChange}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{filters.salaryRange[0].toLocaleString()} LKR</span>
                <span>{filters.salaryRange[1].toLocaleString()} LKR</span>
              </div>
            </div>
          </FilterBlock>
        </div>
      )}
    </div>
  );
};

export default FilterSection;

/* Small presentational component to reduce repetition */
interface BlockProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}

const FilterBlock: React.FC<BlockProps> = ({ icon: Icon, label, children }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-heading mb-3">
      <Icon className="w-4 h-4 text-primary" />
      {label}
    </label>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);
