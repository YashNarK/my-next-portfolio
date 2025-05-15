import { IProject } from "../../../data/data.type";
import { db } from "./firebase-client";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

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
