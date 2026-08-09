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
  thumbUrl?: string;
  /**
   * A tiny inline base64 JPEG (LQIP) of the cropped photo, generated at upload
   * time. Because it travels inside the Firestore document rather than as its
   * own request, it can be painted immediately — the circle is never empty
   * while the full-resolution photo downloads.
   */
  blurDataURL?: string;
}

const PROFILE_DOC = "profile";

export async function getProfileConfig(): Promise<ProfileConfig> {
  const snap = await getDoc(doc(db, COLLECTION, PROFILE_DOC));
  if (snap.exists()) {
    const data = snap.data() as ProfileConfig;
    return {
      imageUrl: data.imageUrl ?? "",
      thumbUrl: data.thumbUrl ?? "",
      blurDataURL: data.blurDataURL ?? "",
    };
  }
  return { imageUrl: "", thumbUrl: "", blurDataURL: "" };
}

export async function updateProfileConfig(
  config: Partial<ProfileConfig>,
): Promise<void> {
  await setDoc(doc(db, COLLECTION, PROFILE_DOC), config, { merge: true });
}
