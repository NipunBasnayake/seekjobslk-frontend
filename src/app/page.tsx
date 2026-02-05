import { HomePageClient } from "@/components/HomePageClient";
import { getActiveJobsServer } from "@/services/firestore.server";

export default async function HomePage() {
  const initialJobs = await getActiveJobsServer();

  return <HomePageClient initialJobs={initialJobs} />;
}
