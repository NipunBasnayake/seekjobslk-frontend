import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const revalidate = 60;

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

export default async function Image() {
  const logoDataUrl = await getLocalImageDataUrl("images/seekjobslk-icon.png");

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          background: "linear-gradient(135deg, #ffffff 0%, #f7fcff 100%)",
          padding: "68px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "196px",
            height: "196px",
            borderRadius: "44px",
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "48px",
            border: "1px solid #e5e7eb",
          }}
        >
          <img
            src={logoDataUrl}
            alt="SeekJobsLk logo"
            width={132}
            height={132}
            style={{
              objectFit: "contain",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "760px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.05,
              color: "#0f172a",
              marginBottom: "22px",
            }}
          >
            SeekJobsLk
          </div>

          <div
            style={{
              fontSize: 30,
              lineHeight: 1.3,
              color: "#334155",
              marginBottom: "32px",
            }}
          >
            Discover verified jobs in Sri Lanka. Search by category, company, location, and salary.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 22,
              color: "#475569",
              fontWeight: 600,
            }}
          >
            seekjobslk.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}