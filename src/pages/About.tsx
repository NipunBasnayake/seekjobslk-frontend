import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { Briefcase, ShieldCheck, Globe, Users } from "lucide-react";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | SeekJobsLk</title>
        <meta
          name="description"
          content="Learn more about SeekJobsLk, a Sri Lanka focused job portal helping job seekers connect with real opportunities."
        />
      </Helmet>

      <Navbar />

      {/* Hero Section */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-20 max-w-5xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            About <span className="text-primary">SeekJobsLk</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A trusted Sri Lanka–focused job portal helping job seekers discover
            real opportunities faster and smarter.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Who We Are */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            SeekJobsLk is a Sri Lanka–focused job portal created to simplify the
            job search process for job seekers across the country. Our goal is
            to make job discovery easier, faster, and more transparent.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We collect and share job listings from trusted employers, official
            company pages, and public job platforms—allowing applicants to apply
            directly via company websites, email, or WhatsApp.
          </p>
        </section>

        {/* Feature Cards */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <Feature
            icon={<Briefcase />}
            title="Verified Listings"
            description="Jobs sourced from trusted employers and public platforms."
          />
          <Feature
            icon={<Globe />}
            title="Sri Lanka Focused"
            description="Opportunities across all major industries in Sri Lanka."
          />
          <Feature
            icon={<Users />}
            title="Job Seeker First"
            description="Simple, fast, and distraction-free job browsing."
          />
          <Feature
            icon={<ShieldCheck />}
            title="Transparent Platform"
            description="We do not charge job seekers or interfere in hiring."
          />
        </section>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is to connect Sri Lankan job seekers with real job
            opportunities while maintaining transparency, simplicity, and
            trust. We aim to reduce fake listings and help users make informed
            career decisions.
          </p>
        </section>

        {/* Transparency & Disclaimer */}
        <section className="rounded-2xl border bg-muted/30 p-8">
          <h2 className="text-2xl font-bold mb-4">
            Transparency & Disclaimer
          </h2>
          <p className="text-muted-foreground mb-3 leading-relaxed">
            SeekJobsLk is <strong>not a recruitment agency</strong>. We do not
            guarantee job placements and do not participate in the hiring
            process.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            All applications are made directly to employers. Job seekers are
            encouraged to verify job details and employer authenticity before
            applying.
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default About;

/* ---------------- Feature Card ---------------- */

const Feature = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition">
    <div className="mb-3 text-primary">{icon}</div>
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);
