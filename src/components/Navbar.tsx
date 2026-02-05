"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, Briefcase } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface NavbarProps {
  totalJobs?: number;
}

export function Navbar({ totalJobs }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
    ],
    []
  );

  const isActive = (href: string) =>
    href === "/"
      ? pathname === href
      : pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Jobs count */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center "
          >
            <span className="grid h-8 w-8 place-items-center ">
              <Briefcase className="h-4 w-4" />
            </span>
            <span>SeekJobsLk</span>
          </Link>

          {typeof totalJobs === "number" ? (
            <span className="hidden items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {totalJobs} active jobs
            </span>
          ) : null}
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={toggleTheme}
            className="ml-2 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-card transition hover:border-primary/40"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4" />
                <span className="hidden lg:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span className="hidden lg:inline">Dark</span>
              </>
            )}
          </button>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-card transition hover:border-primary/40"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-card transition hover:border-primary/40"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={[
          "md:hidden overflow-hidden border-t border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70",
          isMobileMenuOpen ? "max-h-96" : "max-h-0",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={[
                    "rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}

            {typeof totalJobs === "number" ? (
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {totalJobs} active jobs
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
