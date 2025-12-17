import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { Mail, Clock, HelpCircle } from "lucide-react";
import ConnectWithUs from "@/components/ConnectWithUs";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | SeekJobsLk</title>
        <meta
          name="description"
          content="Contact SeekJobsLk for support, feedback, or reporting job listing issues."
        />
      </Helmet>

      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold mb-4">
            Contact <span className="text-primary">SeekJobsLk</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a question, feedback, or need to report a job listing?  
            We’re here to help.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Contact Info */}
          <section className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">Email Us</h2>
                <p className="text-muted-foreground text-sm mb-2">
                  For support, feedback, or job listing issues
                </p>
                <a
                  href="mailto:seekjobslanka@gmail.com"
                  className="text-primary font-medium underline underline-offset-4"
                >
                  seekjobslanka@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">Response Time</h2>
                <p className="text-muted-foreground text-sm">
                  We usually respond within <strong>24–48 hours</strong> on
                  business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">Important Note</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  SeekJobsLk is not a recruitment agency. We do not participate
                  in the hiring process. Please contact employers directly for
                  application updates.
                </p>
              </div>
            </div>
          </section>

          {/* Social / Community */}
          <section className="flex items-start">
            <ConnectWithUs />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SeekJobsLk. We’re happy to hear from you.
        </div>
      </footer>
    </>
  );
};

export default Contact;
