import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | SeekJobsLk</title>
        <meta
          name="description"
          content="Privacy Policy for SeekJobsLk explaining cookies, ads, and third-party services."
        />
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>

        <p className="text-muted-foreground">
          At SeekJobsLk, we respect your privacy. This Privacy Policy explains how
          we collect, use, and protect your information.
        </p>

        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Basic usage data such as pages visited</li>
          <li>Cookies to improve user experience</li>
        </ul>

        <h2 className="text-xl font-semibold">Cookies & Advertising</h2>
        <p className="text-muted-foreground">
          SeekJobsLk uses cookies and third-party services such as Google to
          display advertisements and analyze traffic. Google may use cookies
          (including the DART cookie) to show ads based on your visits to this and
          other websites.
        </p>

        <h2 className="text-xl font-semibold">Third-Party Links</h2>
        <p className="text-muted-foreground">
          Job listings may link to external websites. We are not responsible for
          the privacy practices or content of those sites.
        </p>

        <h2 className="text-xl font-semibold">Consent</h2>
        <p className="text-muted-foreground">
          By using SeekJobsLk, you consent to this Privacy Policy.
        </p>
      </main>
    </>
  );
};

export default PrivacyPolicy;
