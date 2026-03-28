/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { BRAND_LOGO_PATH } from "@/lib/brand";
import { getCompanyName } from "@/lib/jobPresentation";
import { getJobByIdServer } from "@/services/firestore.server";
import type { Job } from "@/types";

export const runtime = "nodejs";
export const alt = "SeekJobsLk job preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const revalidate = 300;

interface JobOgImageProps {
  params: Promise<{
    id: string;
  }>;
}

const BRAND_ICON_RELATIVE_PATH = BRAND_LOGO_PATH.replace(/^\//, "");
const LOGO_FETCH_TIMEOUT_MS = 2500;
const MAX_REMOTE_LOGO_BYTES = 1_500_000;
const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

function trimValue(value: string | undefined, maxLength: number, fallback: string): string {
  const normalized = value?.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return fallback;
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function getInitials(label: string): string {
  const letters = label
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return letters || "SJ";
}

function buildSubtitle(location: string, employmentType: string): string {
  return employmentType ? `${location} - ${employmentType}` : location;
}

async function getLocalImageDataUrl(relativePath: string): Promise<string | null> {
  try {
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
  } catch {
    return null;
  }
}

function resolveMimeType(rawContentType: string | null, url: string): string | null {
  const normalizedHeader = rawContentType?.split(";")[0]?.trim().toLowerCase();
  if (normalizedHeader && ALLOWED_MIME_TYPES.has(normalizedHeader)) {
    return normalizedHeader;
  }

  try {
    const pathname = new URL(url).pathname.toLowerCase();
    if (pathname.endsWith(".png")) return "image/png";
    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
    if (pathname.endsWith(".webp")) return "image/webp";
    if (pathname.endsWith(".gif")) return "image/gif";
    if (pathname.endsWith(".svg")) return "image/svg+xml";
  } catch {
    return null;
  }

  return null;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      redirect: "follow",
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function remoteImageToDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetchWithTimeout(url, LOGO_FETCH_TIMEOUT_MS);
    if (!response.ok) {
      return null;
    }

    const mimeType = resolveMimeType(response.headers.get("content-type"), url);
    if (!mimeType) {
      return null;
    }

    const contentLengthHeader = response.headers.get("content-length");
    const contentLength = contentLengthHeader ? Number(contentLengthHeader) : 0;
    if (Number.isFinite(contentLength) && contentLength > MAX_REMOTE_LOGO_BYTES) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer.byteLength || arrayBuffer.byteLength > MAX_REMOTE_LOGO_BYTES) {
      return null;
    }

    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return null;
  }
}

function pickCompanyLogoUrl(job: Job): string | null {
  const companyRecord = job.company as { logo_url?: string; logo?: string } | undefined;
  const candidates = [
    companyRecord?.logo_url,
    companyRecord?.logo,
    (job as { companyLogo?: unknown }).companyLogo,
    (job as { company_logo?: unknown }).company_logo,
    (job as { logo_url?: unknown }).logo_url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string") {
      continue;
    }

    const value = candidate.trim();
    if (!value) {
      continue;
    }

    try {
      const parsed = new URL(value);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.toString();
      }
    } catch {
      continue;
    }
  }

  return null;
}

function renderLogo(logoDataUrl: string | null, label: string) {
  if (logoDataUrl) {
    return (
      <img
        src={logoDataUrl}
        alt={`${label} logo`}
        width={124}
        height={124}
        style={{
          width: 124,
          height: 124,
          objectFit: "contain",
          borderRadius: 22,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: 124,
        height: 124,
        borderRadius: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1f2937",
        color: "#f8fafc",
        fontSize: 46,
        fontWeight: 800,
      }}
    >
      {getInitials(label)}
    </div>
  );
}

interface OgCardProps {
  title: string;
  companyName: string;
  subtitle: string;
  footerText: string;
  logoDataUrl: string | null;
}

function OgCard({ title, companyName, subtitle, footerText, logoDataUrl }: OgCardProps) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px",
        background: "linear-gradient(135deg, #0b1220 0%, #111827 58%, #1d4ed8 100%)",
        color: "#f8fafc",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: 24,
            padding: "14px 18px",
          }}
        >
          {renderLogo(logoDataUrl, companyName)}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>
              {companyName}
            </span>
            <span style={{ marginTop: 8, fontSize: 21, color: "#dbeafe" }}>{subtitle}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            color: "#dbeafe",
          }}
        >
          <span style={{ fontSize: 19, fontWeight: 700 }}>seekjobslk.com</span>
          <span style={{ fontSize: 18, marginTop: 4 }}>Verified jobs</span>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          marginTop: 14,
        }}
      >
        <div
          style={{
            fontSize: 69,
            lineHeight: 1.06,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-1px",
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.28)",
          paddingTop: 20,
          color: "#e2e8f0",
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        <span>{footerText}</span>
        <span>Apply on SeekJobsLk</span>
      </div>
    </div>
  );
}

export default async function Image({ params }: JobOgImageProps) {
  const { id } = await params;
  const brandLogoDataUrl = await getLocalImageDataUrl(BRAND_ICON_RELATIVE_PATH);

  try {
    const job = await getJobByIdServer(id);

    if (!job) {
      return new ImageResponse(
        (
          <OgCard
            title="Job listing unavailable"
            companyName="SeekJobsLk"
            subtitle="Explore latest verified opportunities"
            footerText="This posting may have expired"
            logoDataUrl={brandLogoDataUrl}
          />
        ),
        size,
      );
    }

    const companyName = trimValue(getCompanyName(job), 52, "SeekJobsLk");
    const location = trimValue(job.location ?? "Sri Lanka", 36, "Sri Lanka");
    const employmentType = trimValue(job.employment_type ?? job.job_type, 24, "");
    const title = trimValue(job.title, 88, "Job Opportunity");
    const subtitle = buildSubtitle(location, employmentType);

    let logoDataUrl = brandLogoDataUrl;
    const remoteLogoUrl = pickCompanyLogoUrl(job);
    if (remoteLogoUrl) {
      const remoteLogoDataUrl = await remoteImageToDataUrl(remoteLogoUrl);
      if (remoteLogoDataUrl) {
        logoDataUrl = remoteLogoDataUrl;
      }
    }

    return new ImageResponse(
      (
        <OgCard
          title={title}
          companyName={companyName}
          subtitle={subtitle}
          footerText="Verified job opportunity in Sri Lanka"
          logoDataUrl={logoDataUrl}
        />
      ),
      size,
    );
  } catch {
    return new ImageResponse(
      (
        <OgCard
          title="Explore verified jobs in Sri Lanka"
          companyName="SeekJobsLk"
          subtitle="New opportunities updated regularly"
          footerText="Social preview fallback"
          logoDataUrl={brandLogoDataUrl}
        />
      ),
      size,
    );
  }
}
