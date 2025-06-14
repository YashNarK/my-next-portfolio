// src/lib/firebase/firebase-admin.ts
import {
  cert,
  getApp,
  getApps,
  initializeApp
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Make sure only one admin app is initialized
const adminApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }), // or use cert() with a service account key
    });

export const adminAuth = getAuth(adminApp);
