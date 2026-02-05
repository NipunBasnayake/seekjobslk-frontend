import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SeekJobsLk | Sri Lanka Job Portal",
    template: "%s | SeekJobsLk",
  },
  description:
    "Discover verified jobs in Sri Lanka. Search by category, company, location, and salary on SeekJobsLk.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "SeekJobsLk",
    title: "SeekJobsLk | Sri Lanka Job Portal",
    description:
      "Discover verified jobs in Sri Lanka. Search by category, company, location, and salary on SeekJobsLk.",
    images: [`${siteUrl}/og-default.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "SeekJobsLk | Sri Lanka Job Portal",
    description:
      "Discover verified jobs in Sri Lanka. Search by category, company, location, and salary on SeekJobsLk.",
    images: [`${siteUrl}/og-default.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${spaceGrotesk.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
