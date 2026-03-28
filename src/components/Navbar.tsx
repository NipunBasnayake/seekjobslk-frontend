"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Briefcase } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  totalJobs?: number;
}

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];

export function Navbar({ totalJobs }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === href
      : pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border/85 bg-background/92 backdrop-blur-xl supports-backdrop-filter:bg-background/88">
      <div className="ui-shell flex h-18 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full px-1 py-1 text-foreground"
            aria-label="SeekJobsLk home"
          >
            <span className="grid text-primary shadow-card">
              <Image src="/images/SeekJobsLk Icon.png" alt="SeekJobsLk logo" width={32} height={32} className="h-8 w-8 object-contain" priority />
            </span>
            <span className="truncate font-semibold text-lg tracking-tight">SeekJobsLk</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn("ui-nav-link", active && "ui-nav-link-active")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="ui-button ui-button-secondary h-11 w-11 px-0 shadow-card"
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
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border/70 bg-background/96 backdrop-blur-xl transition-[max-height,opacity] duration-200 md:hidden",
          isMobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="ui-shell py-3">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn("ui-nav-link w-full justify-start rounded-2xl", active && "ui-nav-link-active")}
                >
                  {link.label}
                </Link>
              );
            })}

            {typeof totalJobs === "number" ? (
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary" />
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
