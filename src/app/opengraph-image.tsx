import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const logoUrl = "https://seekjobslk.com/images/SeekJobsLk%20Icon.png";
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          border: "1px solid #eee",
        }}
      >
        <img
          src={logoUrl}
          width={160}
          height={160}
          style={{ borderRadius: 32, marginBottom: 32 }}
        />
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "#1a202c",
            marginBottom: 24,
            fontFamily: "sans-serif",
            letterSpacing: "-2px",
          }}
        >
          SeekJobsLk
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#444",
            fontFamily: "sans-serif",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Discover verified jobs in Sri Lanka. Search by category, company, location, and salary.
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
