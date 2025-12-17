import React, { useState, useEffect, useCallback } from "react";
import {
  Filter,
  MapPin,
  Building2,
  Briefcase,
  ChevronDown,
  ChevronUp,
  X,
  Check,
} from "lucide-react";
import { getCategories, getCompanies } from "@/services/firebaseData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category, Company } from "@/types";
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

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Remote", "Hybrid"];
const LOCATIONS = ["Colombo", "Kandy", "Galle", "Negombo", "Jaffna", "Remote"];
const DEFAULT_SALARY: [number, number] = [0, 500000];

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFilterChange,
}) => {
  // 🔹 collapsed by default
  const [isExpanded, setIsExpanded] = useState(false);

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
    (filters.location !== "all" ? 1 : 0);

  const showLocation =
    !filters.jobTypes.includes("Remote") || filters.jobTypes.length > 1;

  return (
    <div className="bg-card rounded-xl border shadow-card overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
        onClick={() => setIsExpanded((p) => !p)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Filter Jobs</h3>
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
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
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
            <SearchableDropdown
              placeholder="Search categories..."
              selected={filters.categories}
              items={categories}
              onSelect={(id) => toggleValue("categories", id)}
            />
          </FilterBlock>

          {/* Companies */}
          <FilterBlock icon={Building2} label="Companies">
            <SearchableDropdown
              placeholder="Search companies..."
              selected={filters.companies}
              items={companies}
              onSelect={(id) => toggleValue("companies", id)}
            />
          </FilterBlock>

          {/* Job Types */}
          <FilterBlock icon={Briefcase} label="Job Type">
            {JOB_TYPES.map((type) => (
              <Badge
                key={type}
                variant={
                  filters.jobTypes.includes(type) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleValue("jobTypes", type)}
              >
                {type}
              </Badge>
            ))}
          </FilterBlock>

          {/* Location */}
          {showLocation && (
            <FilterBlock icon={MapPin} label="Location">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-64 justify-between"
                  >
                    {filters.location !== "all"
                      ? filters.location
                      : "Select location"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
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
                          className={`mr-2 h-4 w-4 ${filters.location === "all"
                              ? "opacity-100"
                              : "opacity-0"
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
                            className={`mr-2 h-4 w-4 ${filters.location === loc
                                ? "opacity-100"
                                : "opacity-0"
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

interface FilterBlockProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}

const FilterBlock: React.FC<FilterBlockProps> = ({
  icon: Icon,
  label,
  children,
}) => (
  <div>
    <label className="flex items-center gap-2 mb-3 text-sm font-medium">
      <Icon className="w-4 h-4 text-primary" />
      {label}
    </label>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

interface DropdownItem {
  id: string;
  name: string;
}

interface SearchableDropdownProps {
  items: DropdownItem[];
  selected: string[];
  placeholder: string;
  onSelect: (id: string) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  items,
  selected,
  placeholder,
  onSelect,
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="w-full md:w-64 justify-between"
      >
        {selected.length > 0
          ? `${selected.length} selected`
          : "Select"}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>

    <PopoverContent className="w-full md:w-64 p-0">
      <Command>
        <CommandInput placeholder={placeholder} />
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.id}
              value={item.name}
              onSelect={() => onSelect(item.id)}
            >
              <Check
                className={`mr-2 h-4 w-4 ${selected.includes(item.id)
                    ? "opacity-100"
                    : "opacity-0"
                  }`}
              />
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </PopoverContent>

    {selected.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map((id) => {
          const item = items.find((i) => i.id === id);
          if (!item) return null;

          return (
            <Badge
              key={id}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onSelect(id)}
            >
              {item.name}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          );
        })}
      </div>
    )}
  </Popover>
);
