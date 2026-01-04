import React, { useEffect } from "react";

export const useAccessibilityChecker = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const buttons = document.querySelectorAll("button");
      buttons.forEach((btn) => {
        const hasAccessibleName =
          btn.textContent?.trim() ||
          btn.getAttribute("aria-label") ||
          btn.getAttribute("aria-labelledby") ||
          btn.title;

        if (!hasAccessibleName) {
          console.warn("[A11y] Button without accessible name:", btn);
        }
      });

      const checkContrast = () => {
        const allElements = document.querySelectorAll("*");
        allElements.forEach((el) => {
          const style = window.getComputedStyle(el);
          const bg = style.backgroundColor;
          const fg = style.color;

          if (fg === "rgba(0, 0, 0, 0)" || bg === "transparent") {
            console.debug("[A11y] Low contrast possible on:", el);
          }
        });
      };

      checkContrast();
    }
  }, []);
};

export const createStructuredData = (type: string, data: any) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export const createOrganizationSchema = () => {
  return createStructuredData("Organization", {
    name: "SeekJobsLk",
    url: "https://seekjobslk.com",
    logo: "https://seekjobslk.com/logo.png",
    description: "Find your dream job in Sri Lanka",
    sameAs: [
      "https://www.facebook.com/seekjobslk",
      "https://www.instagram.com/seekjobslk",
      "https://twitter.com/seekjobslk",
    ],
  });
};

export const createJobPostingSchema = (job: any) => {
  return createStructuredData("JobPosting", {
    title: job.title,
    description: job.description,
    datePosted: job.posted_date?.toISOString?.(),
    baseSalary: job.salary_min && {
      "@type": "PriceSpecification",
      priceCurrency: "LKR",
      price: job.salary_min,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "LK",
        addressLocality: job.location || "Sri Lanka",
      },
    },
    hiringOrganization: {
      "@type": "Organization",
      name: job.company?.name,
      logo: job.company?.logo_url,
    },
    employmentType: job.job_type || "FULL_TIME",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "LK",
    },
  });
};

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return createStructuredData("BreadcrumbList", {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
};

export const optimizeMetaTags = (title: string, description: string, imageUrl?: string) => {
  return {
    title,
    description,
    "og:title": title,
    "og:description": description,
    "og:type": "website",
    "og:site_name": "SeekJobsLk",
    "twitter:card": "summary_large_image",
    "twitter:title": title,
    "twitter:description": description,
    ...(imageUrl && {
      "og:image": imageUrl,
      "twitter:image": imageUrl,
    }),
  };
};
