import { storage } from "./firebase-client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, `images/${path}`);
  const metadata = {
    cacheControl: "public, max-age=31536000", // Example: Cache for 1 year
  };

  await uploadBytes(storageRef, file, metadata);
  const url = await getDownloadURL(storageRef);
  return url;
}

/**
 * Uploads a monochrome SVG skill icon to Firebase Storage under `svg/skills/`
 * and returns the download URL. The icon is rendered via CSS mask, so only its
 * silhouette (alpha) matters — colour is applied per group at render time.
 * @param file - The SVG file to upload
 * @param key - Stable skill slug used as the filename (e.g. "react")
 */
export async function uploadSkillIcon(file: File, key: string): Promise<string> {
  const storageRef = ref(storage, `svg/skills/${key}.svg`);
  const metadata = {
    contentType: "image/svg+xml",
    cacheControl: "public, max-age=31536000",
  };
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}

/**
 * Uploads an audio file to Firebase Storage and returns the download URL.
 * @param file - The audio file to upload
 * @param path - The path (without extension) to store the audio file under `audio/`
 * @returns A promise that resolves to the download URL of the uploaded audio
 */
export async function uploadAudio(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, `audio/${path}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
