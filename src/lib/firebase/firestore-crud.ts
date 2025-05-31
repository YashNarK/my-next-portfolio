import { db } from "./firebase-client";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";

// Create collection ref
function getCollectionRef<T = DocumentData>(
  path: string
): CollectionReference<T> {
  return collection(db, path) as CollectionReference<T>;
}

// Generic CRUD functions
export async function getAll<T>(
  collectionName: string
): Promise<(T & { id: string })[]> {
  const snapshot = await getDocs(getCollectionRef<T>(collectionName));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as T),
  }));
}

export async function add<T>(collectionName: string, data: T): Promise<string> {
  const docRef = await addDoc(getCollectionRef<T>(collectionName), data);
  return docRef.id;
}

export async function update<T>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
}

export async function remove(
  collectionName: string,
  id: string
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}
