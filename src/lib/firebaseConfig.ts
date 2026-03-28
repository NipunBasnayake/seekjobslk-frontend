import { env } from "@/lib/env";

export const firebaseClientConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

export const hasFirebaseClientConfig = Object.values(firebaseClientConfig).every(
  (value) => typeof value === "string" && value.length > 0,
);
