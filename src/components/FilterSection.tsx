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
import { Badge } from "@/components/ui/badge";
import { Category, Company } from "@/types/index";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";


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

  const activeFiltersCount =
    filters.categories.length +
    filters.companies.length +
    filters.jobTypes.length +
    (filters.location && filters.location !== "all" ? 1 : 0) +
    (filters.salaryRange[0] !== DEFAULT_SALARY[0] ||
      filters.salaryRange[1] !== DEFAULT_SALARY[1]
      ? 1
      : 0);

  const showLocation =
    !filters.jobTypes.includes("Remote") || filters.jobTypes.length > 1;

  return (
    <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden transition-all duration-300">
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

      {isExpanded && (
        <div className="p-4 pt-0 space-y-6 animate-slide-up">
          <FilterBlock icon={Briefcase} label="Categories">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full md:w-64 justify-between"
                >
                  {filters.categories.length > 0
                    ? `${filters.categories.length} selected`
                    : "Select categories"}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full md:w-64 p-0">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandEmpty>No category found.</CommandEmpty>

                  <CommandGroup>
                    {categories.map((category) => {
                      const isSelected = filters.categories.includes(category.id);

                      return (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={() => toggleValue("categories", category.id)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"
                              }`}
                          />
                          {category.name}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {filters.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.categories.map((id) => {
                  const cat = categories.find((c) => c.id === id);
                  if (!cat) return null;

                  return (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => toggleValue("categories", id)}
                    >
                      {cat.name}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  );
                })}
              </div>
            )}
          </FilterBlock>

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

          {showLocation && (
            <FilterBlock icon={MapPin} label="Location">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full md:w-64 justify-between"
                  >
                    {filters.location && filters.location !== "all"
                      ? filters.location
                      : "Select location"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full md:w-64 p-0">
                  <Command>
                    <CommandInput placeholder="Search location..." />
                    <CommandEmpty>No location found.</CommandEmpty>

                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => handleLocationChange("all")}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${filters.location === "all" ? "opacity-100" : "opacity-0"
                            }`}
                        />
                        All Locations
                      </CommandItem>

                      {LOCATIONS.map((loc) => (
                        <CommandItem
                          key={loc}
                          value={loc}
                          onSelect={() => handleLocationChange(loc)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${filters.location === loc ? "opacity-100" : "opacity-0"
                              }`}
                          />
                          {loc}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </FilterBlock>
          )}

        </div>
      )}
    </div>
  );
};

export default FilterSection;

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
