import { IProject, IPublication } from "../../../data/data.type";
import { db } from "./firebase-client";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Projects CRUD
const projectsCollection = collection(db, "projects");
export async function getAllProjects(): Promise<(IProject & { id: string })[]> {
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as IProject),
  }));
}

export async function addProject(project: IProject): Promise<string> {
  const docRef = await addDoc(projectsCollection, project);
  return docRef.id;
}

export async function updateProject(
  id: string,
  project: Partial<IProject>
): Promise<void> {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, project);
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
}

// Publications CRUD
const publicationsCollection = collection(db, "publications");
export async function getAllPublications(): Promise<
  (IPublication & { id: string })[]
> {
  const snapshot = await getDocs(publicationsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as IPublication),
  }));
}

export async function addPublication(
  publication: IPublication
): Promise<string> {
  const docRef = await addDoc(publicationsCollection, publication);
  return docRef.id;
}

export async function updatePublication(
  id: string,
  publiation: Partial<IPublication>
): Promise<void> {
  const docRef = doc(db, "publications", id);
  await updateDoc(docRef, publiation);
}

export async function deletePublciation(id: string): Promise<void> {
  const docRef = doc(db, "publications", id);
  await deleteDoc(docRef);
}
