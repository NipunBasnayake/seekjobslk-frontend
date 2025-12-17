import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  Briefcase,
  UserCheck,
  ExternalLink,
  RefreshCcw,
} from "lucide-react";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | SeekJobsLk</title>
        <meta
          name="description"
          content="Terms and Conditions governing the use of the SeekJobsLk job portal."
        />
      </Helmet>

      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Please Read Carefully
          </div>
          <h1 className="text-4xl font-extrabold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            These terms govern your access to and use of the SeekJobsLk website.
            By using our platform, you agree to these conditions.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-3xl space-y-10">
        {/* Introduction */}
        <section>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using <strong>SeekJobsLk</strong>, you acknowledge
            that you have read, understood, and agree to be bound by these Terms
            and Conditions. If you do not agree, please discontinue use of the
            website.
          </p>
        </section>

        {/* Job Listings */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Job Listings & Applications
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            SeekJobsLk aggregates and displays job opportunities sourced from
            employers, recruitment platforms, and public listings. We do not
            guarantee job availability, accuracy, legitimacy, or hiring
            outcomes.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            All applications are made directly with employers via external
            websites, email, or messaging platforms such as WhatsApp.
          </p>
        </section>

        {/* User Responsibility */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            User Responsibilities
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Users are solely responsible for verifying the authenticity of job
            listings and employers before applying. SeekJobsLk is not liable for
            any loss, damage, fraud, or disputes arising from job applications.
          </p>
        </section>

        {/* External Links */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            External Links
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Our website may contain links to third-party websites. We do not
            control or endorse the content, policies, or practices of these
            external sites and are not responsible for any interactions with
            them.
          </p>
        </section>

        {/* Modifications */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-primary" />
            Changes to These Terms
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            SeekJobsLk reserves the right to modify or replace these Terms &
            Conditions at any time without prior notice. Continued use of the
            website after changes indicates acceptance of the updated terms.
          </p>
        </section>

        {/* Notice Box */}
        <section className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            These Terms & Conditions are effective as of the date published on
            this page. We recommend reviewing them periodically.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SeekJobsLk. Use of this website is subject
          to these terms.
        </div>
      </footer>
    </>
  );
};

export default Terms;
