function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseCsvEnv(name: string): string[] {
  const value = readEnv(name);
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

const fallbackSiteUrl = "http://localhost:3000";

export const env = {
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? fallbackSiteUrl,
  googleAnalyticsId: readEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID"),
  googleAdsenseClientId: readEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID"),
  firebase: {
    apiKey: readEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  },
  trustedImageHosts: parseCsvEnv("NEXT_PUBLIC_TRUSTED_IMAGE_HOSTS"),
  applyVerificationSeconds: Number(readEnv("NEXT_PUBLIC_APPLY_VERIFICATION_SECONDS")) || 10,
};
