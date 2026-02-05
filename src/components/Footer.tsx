import Link from "next/link";
import {
  Briefcase,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background">
                <Briefcase className="h-4 w-4 text-foreground" />
              </div>
              <span className="text-lg font-semibold">SeekJobsLk</span>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Your trusted job portal in Sri Lanka. Discover verified job
              opportunities from top companies and grow your career with
              confidence.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="transition hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Job seekers */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Job Seekers
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#jobs" className="transition hover:text-foreground">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="#jobs" className="transition hover:text-foreground">
                  Latest Jobs
                </a>
              </li>
              <li>
                <a href="#jobs" className="transition hover:text-foreground">
                  Remote Jobs
                </a>
              </li>
              <li>
                <a href="#jobs" className="transition hover:text-foreground">
                  Featured Jobs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:seekjobslanka@gmail.com"
                  className="transition hover:text-foreground"
                >
                  seekjobslanka@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +94 75 880 6028
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Sri Lanka
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            (c) {new Date().getFullYear()} SeekJobsLk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
