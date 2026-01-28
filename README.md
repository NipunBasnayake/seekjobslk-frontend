**SeekJobsLK** is a Sri Lanka–focused job portal for discovering and sharing real job opportunities.

The frontend is now built on **Next.js (App Router)** with Firebase as the source of truth.

Live: **https://seekjobslk.com/**

### Tech Stack

- Next.js (App Router)
- React + TypeScript
- Firebase Firestore
- Tailwind CSS + Radix UI
- Vercel (hosting)

## Local Development

1) Install dependencies
```
npm install
```

2) Create `.env.local` (or update `.env`) with Firebase client config:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-1QFTE4R2PP
```

3) (Recommended) Add Firebase Admin credentials for server-side Firestore:
```
FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON={"project_id":"...","client_email":"...","private_key":"..."}
```
or
```
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

4) Run the dev server
```
npm run dev
```

## SEO / Social Preview Checks

- **WhatsApp / OG Preview**: Job pages now render OG tags server-side.
  - Test with Meta Sharing Debugger (paste a job URL) to force refresh previews.
  - Example: `https://seekjobslk.com/job/<jobId>`
- **Twitter**: `summary_large_image` is set for all pages.

## Sitemap & Robots

- `https://seekjobslk.com/sitemap.xml` (dynamic, includes static pages + active jobs)
- `https://seekjobslk.com/robots.txt` (references sitemap)

## Notes

- If Admin credentials are **not** set, server-side Firestore reads fall back to public client access (reads must be allowed by Firestore rules).
- UI, component behavior, and user flow are preserved from the original Vite SPA.
