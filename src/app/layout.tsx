import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { BRAND_LOGO_PATH } from "@/lib/brand";
import { env } from "@/lib/env";
import { toAbsoluteUrl } from "@/lib/seo";
import { getSiteUrl, SITE_DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
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
const siteName = SITE_NAME;
const defaultDescription = SITE_DEFAULT_DESCRIPTION;
const defaultOgImageUrl = toAbsoluteUrl("/opengraph-image");

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: toAbsoluteUrl(BRAND_LOGO_PATH),
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "seekjobslanka@gmail.com",
      availableLanguage: ["English"],
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: `${siteName} | Sri Lanka Job Portal`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "Sri Lanka jobs",
    "job board",
    "remote jobs",
    "career opportunities",
    "hiring in Sri Lanka",
    "SeekJobsLk",
  ],
  authors: [{ name: `${siteName} Editorial Team` }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: toAbsoluteUrl("/"),
    siteName,
    locale: "en_LK",
    title: `${siteName} | Sri Lanka Job Portal`,
    description: defaultDescription,
    images: [
      {
        url: defaultOgImageUrl,
        width: 1200,
        height: 630,
        alt: `${siteName} - Verified jobs in Sri Lanka`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Sri Lanka Job Portal`,
    description: defaultDescription,
    images: [defaultOgImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = env.googleAnalyticsId;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/images/SeekJobsLk.ico" />
      </head>
      <body
        suppressHydrationWarning
        className={`${plusJakarta.variable} ${spaceGrotesk.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
