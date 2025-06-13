// src/lib/firebase/firebase-admin.ts
import { initializeApp, applicationDefault, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Make sure only one admin app is initialized
const adminApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: applicationDefault(), // or use cert() with a service account key
    });

export const adminAuth = getAuth(adminApp);
