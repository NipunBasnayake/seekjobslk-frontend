import "server-only";

import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

const FIREBASE_ADMIN_PROJECT_ID = process.env.FIREBASE_ADMIN_PROJECT_ID;
const FIREBASE_ADMIN_CLIENT_EMAIL = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const FIREBASE_ADMIN_PRIVATE_KEY = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n",
);

const hasFirebaseAdminConfig = Boolean(
  FIREBASE_ADMIN_PROJECT_ID &&
    FIREBASE_ADMIN_CLIENT_EMAIL &&
    FIREBASE_ADMIN_PRIVATE_KEY,
);

let firebaseAdminApp: App | null = null;
let firebaseAdminDb: Firestore | null = null;

if (hasFirebaseAdminConfig) {
  const existingApp = getApps().find((app) => app.name === "seekjobs-admin");
  firebaseAdminApp =
    existingApp ??
    initializeApp(
      {
        credential: cert({
          projectId: FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
        }),
      },
      "seekjobs-admin",
    );

  firebaseAdminDb = getFirestore(firebaseAdminApp);
}

export function getFirebaseAdminDb(): Firestore | null {
  return firebaseAdminDb;
}

export { firebaseAdminApp, firebaseAdminDb, hasFirebaseAdminConfig };
