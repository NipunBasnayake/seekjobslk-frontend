import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X, ChevronDown, Briefcase } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { categories, companies } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onCategorySelect?: (categoryId: string) => void;
  onCompanySelect?: (companyId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCategorySelect, onCompanySelect }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-navbar shadow-navbar transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-navbar-foreground font-bold text-xl md:text-2xl tracking-tight hover:opacity-90 transition-opacity"
          >
            <Briefcase className="w-7 h-7 md:w-8 md:h-8" />
            <span>SeekJobsLk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="navbar" className="gap-1">
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category.id}
                    onClick={() => onCategorySelect?.(category.id)}
                    className="cursor-pointer"
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Companies Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="navbar" className="gap-1">
                  Companies
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                {companies.map((company) => (
                  <DropdownMenuItem 
                    key={company.id}
                    onClick={() => onCompanySelect?.(company.id)}
                    className="cursor-pointer"
                  >
                    <img 
                      src={company.logo} 
                      alt={company.name} 
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    {company.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="navbar"
              size="icon"
              onClick={toggleTheme}
              className="ml-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="navbar"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="navbar"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-navbar-foreground/20 animate-slide-up">
            <div className="space-y-4">
              {/* Categories */}
              <div>
                <p className="text-navbar-foreground/70 text-sm font-medium mb-2">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        onCategorySelect?.(category.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-navbar-foreground text-left text-sm py-2 px-3 rounded-md hover:bg-navbar-foreground/10 transition-colors"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Companies */}
              <div>
                <p className="text-navbar-foreground/70 text-sm font-medium mb-2">Companies</p>
                <div className="grid grid-cols-2 gap-2">
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => {
                        onCompanySelect?.(company.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center text-navbar-foreground text-left text-sm py-2 px-3 rounded-md hover:bg-navbar-foreground/10 transition-colors"
                    >
                      <img 
                        src={company.logo} 
                        alt={company.name} 
                        className="w-5 h-5 rounded-full mr-2"
                      />
                      {company.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
