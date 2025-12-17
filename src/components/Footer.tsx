import React from "react";
import {
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold">SeekJobsLk</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted job portal in Sri Lanka. Discover verified job
              opportunities from top companies and grow your career with
              confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition">Home</a></li>
              <li><a href="/about" className="hover:text-primary transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary transition">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:text-primary transition">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-primary transition">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 className="font-semibold mb-3">Job Seekers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition">Browse Jobs</a></li>
              <li><a href="/" className="hover:text-primary transition">Latest Jobs</a></li>
              <li><a href="/" className="hover:text-primary transition">Remote Jobs</a></li>
              <li><a href="/" className="hover:text-primary transition">Featured Jobs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                seekjobslanka@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                +94 75 880 6028
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Sri Lanka
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SeekJobsLk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
