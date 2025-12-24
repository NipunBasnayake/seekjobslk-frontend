"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms", path: "/terms" },
  ];

  return (
    <nav className="sticky top-0 z-50 shadow-navbar" style={{ backgroundColor: 'hsl(var(--navbar))' }}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl md:text-2xl hover:opacity-90 transition-opacity"
            style={{ color: 'hsl(var(--navbar-foreground))' }}
          >
            <Briefcase className="w-7 h-7" />
            SeekJobsLk
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  pathname === link.path
                    ? "bg-white/20 dark:bg-white/10"
                    : "hover:bg-white/15 dark:hover:bg-white/10"
                }`}
                style={{ color: 'hsl(var(--navbar-foreground))' }}
              >
                {link.label}
              </Link>
            ))}

            <Button
              variant="navbar"
              size="icon"
              onClick={toggleTheme}
              className="ml-2 hover:bg-white/15 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button 
              variant="navbar" 
              size="icon" 
              onClick={toggleTheme}
              className="hover:bg-white/15 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Button
              variant="navbar"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-white/15 dark:hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 dark:border-white/10 py-4 space-y-2 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                  pathname === link.path
                    ? "bg-white/20 dark:bg-white/10"
                    : "hover:bg-white/15 dark:hover:bg-white/10"
                }`}
                style={{ color: 'hsl(var(--navbar-foreground))' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
