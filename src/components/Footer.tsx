import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { BRAND_LOGO_PATH } from "@/lib/brand";
import { SocialIcon } from "@/components/SocialIcon";

export function Footer() {
  return (
    <footer className="pb-8">
      <div className="ui-shell">
        <div className="ui-card px-6 py-8 md:px-8 md:py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-primary/10 text-primary">
                  <Image src={BRAND_LOGO_PATH} alt="SeekJobsLk logo" width={28} height={28} className="h-7 w-7 object-contain" priority />
                </div>
                <span className="text-lg font-semibold tracking-tight text-foreground">SeekJobsLk</span>
              </div>

              <p className="text-sm leading-7 text-muted-foreground">
                Your trusted job portal in Sri Lanka. Discover verified job
                opportunities from top companies and grow your career with
                confidence.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.03em] text-foreground">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/" className="ui-link-subtle">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="ui-link-subtle">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="ui-link-subtle">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="ui-link-subtle">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="ui-link-subtle">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.03em] text-foreground">
                Job Seekers
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#jobs" className="ui-link-subtle">
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <a href="#jobs" className="ui-link-subtle">
                    Latest Jobs
                  </a>
                </li>
                <li>
                  <a href="#jobs" className="ui-link-subtle">
                    Remote Jobs
                  </a>
                </li>
                <li>
                  <a href="#jobs" className="ui-link-subtle">
                    Featured Jobs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.03em] text-foreground">
                Contact
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:seekjobslanka@gmail.com" className="ui-link-subtle">
                    seekjobslanka@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  +94 75 880 6028
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Sri Lanka
                </li>
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <SocialIcon name="facebook" href="https://facebook.com" label="SeekJobsLk on Facebook" />
                <SocialIcon name="linkedin" href="https://linkedin.com" label="SeekJobsLk on LinkedIn" />
                <SocialIcon name="x" href="https://x.com" label="SeekJobsLk on X" />
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} SeekJobsLk. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
