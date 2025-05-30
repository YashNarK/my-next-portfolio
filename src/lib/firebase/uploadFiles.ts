import { storage } from "./firebase-client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, `images/${path}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
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
