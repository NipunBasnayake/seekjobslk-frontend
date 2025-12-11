import React, { useState } from 'react';
import { Filter, MapPin, Building2, Briefcase, DollarSign, ChevronDown, ChevronUp, X } from 'lucide-react';
import { categories, companies } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

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

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid'];
const locations = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Remote'];

const FilterSection: React.FC<FilterSectionProps> = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleCompanyToggle = (companyId: string) => {
    const newCompanies = filters.companies.includes(companyId)
      ? filters.companies.filter(id => id !== companyId)
      : [...filters.companies, companyId];
    onFilterChange({ ...filters, companies: newCompanies });
  };

  const handleJobTypeToggle = (jobType: string) => {
    const newJobTypes = filters.jobTypes.includes(jobType)
      ? filters.jobTypes.filter(type => type !== jobType)
      : [...filters.jobTypes, jobType];
    onFilterChange({ ...filters, jobTypes: newJobTypes });
  };

  const handleLocationChange = (location: string) => {
    onFilterChange({ ...filters, location });
  };

  const handleSalaryChange = (value: number[]) => {
    onFilterChange({ ...filters, salaryRange: [value[0], value[1]] });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      companies: [],
      jobTypes: [],
      salaryRange: [0, 500000],
      location: '',
    });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.companies.length + 
    filters.jobTypes.length + 
    (filters.location ? 1 : 0) +
    (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 500000 ? 1 : 0);

  const showLocation = !filters.jobTypes.includes('Remote') || filters.jobTypes.length > 1;

  return (
    <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden transition-all duration-300">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-heading">Filter Jobs</h3>
            <p className="text-sm text-muted-foreground">
              {activeFiltersCount > 0 ? `${activeFiltersCount} filters applied` : 'Find your perfect job'}
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
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-6 animate-slide-up">
          {/* Category Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-heading mb-3">
              <Briefcase className="w-4 h-4 text-primary" />
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={filters.categories.includes(category.id) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Company Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-heading mb-3">
              <Building2 className="w-4 h-4 text-primary" />
              Companies
            </label>
            <div className="flex flex-wrap gap-2">
              {companies.map((company) => (
                <Badge
                  key={company.id}
                  variant={filters.companies.includes(company.id) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => handleCompanyToggle(company.id)}
                >
                  <img src={company.logo} alt="" className="w-4 h-4 rounded-full mr-1" />
                  {company.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-heading mb-3">
              <Briefcase className="w-4 h-4 text-primary" />
              Job Type
            </label>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map((type) => (
                <Badge
                  key={type}
                  variant={filters.jobTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => handleJobTypeToggle(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Location Filter - Hidden when only Remote is selected */}
          {showLocation && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-heading mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                Location
              </label>
              <Select value={filters.location} onValueChange={handleLocationChange}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Salary Range Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-heading mb-3">
              <DollarSign className="w-4 h-4 text-primary" />
              Salary Range (LKR)
            </label>
            <div className="px-2">
              <Slider
                value={[filters.salaryRange[0], filters.salaryRange[1]]}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
