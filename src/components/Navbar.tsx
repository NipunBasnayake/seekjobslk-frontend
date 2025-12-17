import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X, Briefcase } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms", path: "/terms" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-navbar shadow-navbar">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-navbar-foreground text-xl md:text-2xl"
          >
            <Briefcase className="w-7 h-7" />
            SeekJobsLk
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-white text-sm font-regular transition
                  ${location.pathname === link.path
                    ? "bg-navbar-foreground/10"
                    : "hover:bg-navbar-foreground/10"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <Button
              variant="navbar"
              size="icon"
              onClick={toggleTheme}
              className="ml-2"
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </Button>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="navbar" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon /> : <Sun />}
            </Button>

            <Button
              variant="navbar"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm rounded-md hover:bg-navbar-foreground/10"
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
