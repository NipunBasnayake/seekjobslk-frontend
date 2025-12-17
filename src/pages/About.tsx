import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | SeekJobsLk</title>
        <meta
          name="description"
          content="Learn more about SeekJobsLk, a Sri Lanka focused job portal helping job seekers connect with employers."
        />
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">About SeekJobsLk</h1>

        <p className="text-muted-foreground mb-4">
          SeekJobsLk is a Sri Lanka–focused job portal created to help job seekers
          discover relevant job opportunities quickly and easily.
        </p>

        <p className="text-muted-foreground mb-4">
          We collect and share job listings from trusted employers and platforms,
          allowing applicants to apply directly via company websites, email, or
          WhatsApp.
        </p>

        <p className="text-muted-foreground">
          SeekJobsLk is not a recruitment agency. We do not guarantee job
          placements and do not participate in the hiring process.
        </p>
      </main>
    </>
  );
};

export default About;
