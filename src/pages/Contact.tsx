import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | SeekJobsLk</title>
        <meta
          name="description"
          content="Contact SeekJobsLk for support, feedback, or job listing issues."
        />
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <p className="text-muted-foreground mb-4">
          Have a question, feedback, or want to report an issue with a job
          listing?
        </p>

        <p className="text-muted-foreground mb-2">
          You can contact us via email:
        </p>

        <p className="font-medium">
          📧{" "}
          <a
            href="mailto:seekjobslanka@gmail.com"
            className="text-primary underline"
          >
            seekjobslanka@gmail.com
          </a>
        </p>

        <p className="text-muted-foreground mt-4">
          We usually respond within 24–48 hours.
        </p>
      </main>
    </>
  );
};

export default Contact;
