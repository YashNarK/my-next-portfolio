// Server-side read of the `siteConfig/profile` document.
//
// Why this exists: the homepage profile picture used to be resolved entirely
// on the client, which serialized three round trips before a single pixel
// appeared — download/parse the JS bundle, initialize the Firebase SDK and
// fetch the Firestore doc, and only then start downloading the image itself.
// Reading the doc here (during SSR/ISR) lets the layout emit a
// `<link rel="preload">` for the photo, so the browser starts fetching it
// while the JS bundle is still in flight, and lets us seed React Query so the
// client never repeats the Firestore call for first paint.
//
// This deliberately uses the Firestore REST API with the public web API key
// rather than firebase-admin: the document is already publicly readable (the
// client SDK reads it unauthenticated on every page load), and avoiding
// firebase-admin here means no service-account credentials are required for
// the homepage to render, and no module-scope `initializeApp` that could
// throw during a server render.

// Type-only: importing the value module would evaluate firebase-client.ts,
// which initializes the Firebase web SDK at module scope.
import type { ProfileConfig } from "./site-config-crud";

// Matches the client-side `staleTime` in useProfileConfig.
const REVALIDATE_SECONDS = 300;

interface FirestoreValue {
  stringValue?: string;
}

interface FirestoreDocument {
  fields?: Record<string, FirestoreValue>;
}

function readString(doc: FirestoreDocument, field: string): string {
  return doc.fields?.[field]?.stringValue ?? "";
}

/**
 * Fetches the profile config on the server. Returns `null` on any failure
 * (missing env vars, denied rules, missing doc, network error) so the caller
 * can silently fall back to the existing client-side fetch — a slow profile
 * picture must never be able to break the page render.
 */
export async function getProfileConfigServer(): Promise<ProfileConfig | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) return null;

  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/siteConfig/profile?key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;

    const doc = (await response.json()) as FirestoreDocument;
    const imageUrl = readString(doc, "imageUrl");
    const thumbUrl = readString(doc, "thumbUrl");
    const blurDataURL = readString(doc, "blurDataURL");

    if (!imageUrl && !thumbUrl) return null;
    return { imageUrl, thumbUrl, blurDataURL };
  } catch {
    return null;
  }
}
