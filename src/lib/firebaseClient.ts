import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { firebaseClientConfig, hasFirebaseClientConfig } from "@/lib/firebaseConfig";

let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;

if (hasFirebaseClientConfig) {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseClientConfig);
  db = getFirestore(firebaseApp);
}

export { db, firebaseApp, hasFirebaseClientConfig };
