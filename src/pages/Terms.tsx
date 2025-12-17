import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | SeekJobsLk</title>
        <meta
          name="description"
          content="Terms and conditions for using the SeekJobsLk job portal."
        />
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>

        <p className="text-muted-foreground">
          By accessing and using SeekJobsLk, you agree to comply with these terms
          and conditions.
        </p>

        <h2 className="text-xl font-semibold">Job Listings</h2>
        <p className="text-muted-foreground">
          SeekJobsLk displays job opportunities provided by employers and third
          parties. We do not guarantee job availability, accuracy, or hiring
          outcomes.
        </p>

        <h2 className="text-xl font-semibold">User Responsibility</h2>
        <p className="text-muted-foreground">
          Users are responsible for verifying job details and applying at their
          own discretion. SeekJobsLk is not liable for any losses or disputes.
        </p>

        <h2 className="text-xl font-semibold">External Links</h2>
        <p className="text-muted-foreground">
          Our website may contain links to external websites. We are not
          responsible for their content or actions.
        </p>

        <h2 className="text-xl font-semibold">Changes to Terms</h2>
        <p className="text-muted-foreground">
          We reserve the right to update these terms at any time without prior
          notice.
        </p>
      </main>
    </>
  );
};

export default Terms;
