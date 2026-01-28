import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Providers from "@/app/providers";
import "./globals.css";

const siteUrl = "https://seekjobslk.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SeekJobsLk - Find Your Dream Job in Sri Lanka",
    template: "%s | SeekJobsLk",
  },
  description:
    "Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies.",
  applicationName: "SeekJobsLk",
  authors: [{ name: "SeekJobsLk" }],
  creator: "SeekJobsLk",
  publisher: "SeekJobsLk",
  keywords: [
    "jobs in Sri Lanka",
    "Sri Lanka careers",
    "job search",
    "employment",
    "vacancies",
    "remote jobs",
    "Colombo jobs",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "SeekJobsLk - Find Your Dream Job in Sri Lanka",
    description:
      "Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies.",
    siteName: "SeekJobsLk",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "SeekJobsLk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@seekjobslk",
    title: "SeekJobsLk - Find Your Dream Job in Sri Lanka",
    description:
      "Discover the best job opportunities in Sri Lanka. Browse thousands of jobs from top companies.",
    images: ["/og-default.jpg"],
  },
  icons: {
    icon: "/briefcase.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1QFTE4R2PP"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1QFTE4R2PP');
          `}
        </Script>
      </body>
    </html>
  );
}
