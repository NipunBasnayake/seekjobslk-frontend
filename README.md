# SeekJobsLk (Next.js + Firestore)

SeekJobsLk is a job posting platform built with Next.js App Router, TypeScript, Tailwind CSS, and Firebase Firestore.

## Required Environment Variables

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Optional Firebase Admin (server-only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

Optional:

```bash
NEXT_PUBLIC_WHATSAPP_CHANNEL_URL=
```

## Run Locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Build

```bash
pnpm build
pnpm start
```

## Firestore Collections Used

- `jobs`
- `companies`
- `categories`
- `stats/visitors`

## SEO Assets

Fallback OpenGraph image path:

- `public/og-default.png`
