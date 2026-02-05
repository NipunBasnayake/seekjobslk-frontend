import "server-only";

import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { firebaseClientConfig, hasFirebaseClientConfig } from "@/lib/firebaseConfig";

const SERVER_APP_NAME = "seekjobs-server";

let firebaseServerApp: FirebaseApp | null = null;
let firebaseServerDb: Firestore | null = null;

if (hasFirebaseClientConfig) {
  const existingApp = getApps().find((app) => app.name === SERVER_APP_NAME);
  firebaseServerApp = existingApp ?? initializeApp(firebaseClientConfig, SERVER_APP_NAME);
  firebaseServerDb = getFirestore(firebaseServerApp);
}

export { firebaseServerApp, firebaseServerDb, hasFirebaseClientConfig as hasFirebaseServerConfig };
