/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE_NAME } from "@/lib/site";

export const runtime = "nodejs";
export const alt = "SeekJobsLk - Verified jobs in Sri Lanka";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const revalidate = 300;

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

function renderBrandIcon(logoDataUrl: string | null) {
  if (logoDataUrl) {
    return (
      <img
        src={logoDataUrl}
        alt="SeekJobsLk logo"
        width={72}
        height={72}
        style={{
          width: 72,
          height: 72,
          objectFit: "contain",
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: "#1f2937",
        color: "#f8fafc",
        fontSize: 30,
        fontWeight: 800,
      }}
    >
      SJ
    </div>
  );
}

export default async function Image() {
  const logoDataUrl = await getLocalImageDataUrl("images/seekjobslk-icon.png");

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px",
          background: "linear-gradient(135deg, #0b1220 0%, #111827 55%, #0f3f7e 100%)",
          color: "#f8fafc",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "16px 22px",
              borderRadius: 22,
              backgroundColor: "rgba(15, 23, 42, 0.78)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            {renderBrandIcon(logoDataUrl)}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1 }}>
                {SITE_NAME}
              </span>
              <span style={{ fontSize: 20, color: "#cbd5e1", marginTop: 6 }}>
                Verified Jobs in Sri Lanka
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#dbeafe",
            }}
          >
            seekjobslk.com
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.06,
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#ffffff",
              maxWidth: "1000px",
            }}
          >
            Discover verified jobs in Sri Lanka
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 31,
              color: "#cbd5e1",
              lineHeight: 1.3,
            }}
          >
            Search by company, category, location, and salary.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.28)",
            paddingTop: 20,
            color: "#e2e8f0",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          <span>Fresh listings</span>
          <span>Direct employer apply options</span>
        </div>
      </div>
    ),
    size,
  );
}
