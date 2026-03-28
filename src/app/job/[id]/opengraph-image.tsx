import { ImageResponse } from "next/og";
import { getJobByIdServer } from "@/services/firestore.server";
import { getCompanyName } from "@/lib/jobPresentation";

export const runtime = "edge";

const FALLBACK_LOGO = "https://seekjobslk.com/images/SeekJobsLk%20Icon.png";

function safeLogoUrl(url?: string | null) {
  if (!url || !/^https?:\/\//.test(url)) return FALLBACK_LOGO;
  return url;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const job = await getJobByIdServer(params.id);

  if (!job) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            border: "1px solid #eee",
          }}
        >
          <span style={{ fontSize: 48, color: "#333" }}>Job Not Found</span>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const companyName = getCompanyName(job);
  const logoUrl = safeLogoUrl(job.company?.logo_url);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: "#fff",
          border: "1px solid #eee",
          padding: 48,
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "0 0 240px", display: "flex", justifyContent: "center" }}>
          <img
            src={logoUrl}
            width={160}
            height={160}
            style={{ borderRadius: 24, background: "#f3f3f3", objectFit: "contain" }}
          />
        </div>
        <div style={{ flex: 1, marginLeft: 48 }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#1a202c", marginBottom: 16, fontFamily: "sans-serif" }}>
            {job.title}
          </div>
          <div style={{ fontSize: 28, color: "#444", marginBottom: 8, fontFamily: "sans-serif" }}>
            {companyName}
          </div>
          <div style={{ fontSize: 22, color: "#666", marginBottom: 8, fontFamily: "sans-serif" }}>
            {job.location || "Sri Lanka"}
            {job.employment_type ? ` • ${job.employment_type}` : ""}
          </div>
          <div style={{ fontSize: 20, color: "#888", marginTop: 32, fontFamily: "sans-serif" }}>
            SeekJobsLk.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
