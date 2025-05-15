import { storage } from "./firebase-client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, `images/${path}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
