import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCompanyName } from "@/lib/jobPresentation";
import { getJobByIdServer } from "@/services/firestore.server";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const revalidate = 60;

interface JobOgImageProps {
  params: Promise<{
    id: string;
  }>;
}

function trimValue(value: string | undefined, maxLength: number): string {
  const normalized = value?.trim();
  if (!normalized) {
    return "";
  }

  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength - 1)}...`
    : normalized;
}

function buildSubtitle(location: string, employmentType?: string): string {
  const normalizedType = employmentType?.trim();
  return normalizedType ? `${location} | ${normalizedType}` : location;
}

async function getLocalImageDataUrl(relativePath: string) {
  const filePath = path.join(process.cwd(), "public", relativePath);
  const file = await readFile(filePath);
  const base64 = file.toString("base64");
  const ext = path.extname(relativePath).toLowerCase();

  const mimeType =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".webp"
          ? "image/webp"
          : "image/png";

  return `data:${mimeType};base64,${base64}`;
}

async function remoteImageToDataUrl(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch remote image: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return `data:${contentType};base64,${base64}`;
}

function pickCompanyLogo(job: any): string | null {
  const candidates = [
    job?.company?.logo_url,
    job?.company?.logo,
    job?.companyLogo,
    job?.company_logo,
    job?.logo_url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      try {
        const parsed = new URL(candidate);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          return parsed.toString();
        }
      } catch {
        // ignore invalid URL
      }
    }
  }

  return null;
}

export default async function Image({ params }: JobOgImageProps) {
  const { id } = await params;
  const job = await getJobByIdServer(id);

  const fallbackLogoDataUrl = await getLocalImageDataUrl("images/seekjobslk-icon.png");

  if (!job) {
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
            background: "#ffffff",
            color: "#0f172a",
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 800, marginBottom: "14px" }}>
            Job Not Found
          </div>
          <div style={{ fontSize: 26, color: "#475569" }}>SeekJobsLk</div>
        </div>
      ),
      size,
    );
  }

  const jobTitle = trimValue(job.title, 80) || "Job Opportunity";
  const companyName = trimValue(getCompanyName(job), 60) || "Unknown Company";
  const location = trimValue(job.location ?? "Sri Lanka", 40) || "Sri Lanka";
  const employmentType = trimValue(job.employment_type ?? job.job_type, 24);
  const subtitle = buildSubtitle(location, employmentType);

  let companyLogoDataUrl = fallbackLogoDataUrl;
  const remoteLogoUrl = pickCompanyLogo(job);

  if (remoteLogoUrl) {
    try {
      companyLogoDataUrl = await remoteImageToDataUrl(remoteLogoUrl);
    } catch {
      companyLogoDataUrl = fallbackLogoDataUrl;
    }
  }

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
          background: "linear-gradient(135deg, #ffffff 0%, #f7fcff 100%)",
          padding: "58px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "38px",
          }}
        >
          <div
            style={{
              width: "156px",
              height: "156px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "32px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <img
              src={companyLogoDataUrl}
              alt={`${companyName} logo`}
              width={110}
              height={110}
              style={{ objectFit: "contain" }}
            />
          </div>

          <div style={{ fontSize: 24, color: "#64748b", fontWeight: 700 }}>
            seekjobslk.com
          </div>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.04,
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#0f172a",
              marginBottom: "22px",
            }}
          >
            {jobTitle}
          </div>

          <div
            style={{
              fontSize: 36,
              lineHeight: 1.2,
              color: "#1e293b",
              fontWeight: 600,
              marginBottom: "14px",
            }}
          >
            {companyName}
          </div>

          <div
            style={{
              fontSize: 26,
              lineHeight: 1.2,
              color: "#475569",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            width: "100%",
            marginTop: "34px",
            height: "1px",
            background: "#e2e8f0",
          }}
        />

        <div
          style={{
            width: "100%",
            marginTop: "22px",
            display: "flex",
            justifyContent: "flex-start",
            fontSize: 22,
            color: "#64748b",
          }}
        >
          Verified jobs in Sri Lanka
        </div>
      </div>
    ),
    size,
  );
}