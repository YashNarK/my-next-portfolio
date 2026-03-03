// CRUD helpers for the "siteConfig" Firestore collection.
// Used for resume URLs, profile pic, and other site-wide settings.

import { db } from "@/lib/firebase/firebase-client";
import { doc, getDoc, setDoc } from "firebase/firestore";

const COLLECTION = "siteConfig";

// ── Resume URLs ──────────────────────────────────────────

export interface ResumeConfig {
  urls: string[]; // max 3
  activeIndex: number;
}

const RESUME_DOC = "resume";

export async function getResumeConfig(): Promise<ResumeConfig> {
  const snap = await getDoc(doc(db, COLLECTION, RESUME_DOC));
  if (snap.exists()) return snap.data() as ResumeConfig;
  return { urls: [], activeIndex: 0 };
}

export async function updateResumeConfig(config: ResumeConfig): Promise<void> {
  await setDoc(doc(db, COLLECTION, RESUME_DOC), config);
}

// ── Profile Pic ──────────────────────────────────────────

export interface ProfileConfig {
  imageUrl: string;
}

const PROFILE_DOC = "profile";

export async function getProfileConfig(): Promise<ProfileConfig> {
  const snap = await getDoc(doc(db, COLLECTION, PROFILE_DOC));
  if (snap.exists()) return snap.data() as ProfileConfig;
  return { imageUrl: "" };
}

export async function updateProfileConfig(config: ProfileConfig): Promise<void> {
  await setDoc(doc(db, COLLECTION, PROFILE_DOC), config);
}
