// Server-side reads of the `notes` collection for the REST API.
//
// The client CRUD in notes-crud.ts goes through the Firebase web SDK and an
// authenticated admin session. API callers present a static bearer token
// instead, so there is no `request.auth` for security rules to evaluate and
// these reads have to go through firebase-admin.

import type { INote } from "../../../data/data.type";
import { noteCategory } from "../notes";

export type StoredNote = INote & { id: string };

/**
 * firebase-admin initializes at module scope and throws when the service
 * account env vars are missing, so it is imported lazily: a misconfigured
 * deployment should fail the request with a readable error, not blow up the
 * whole route module at import time.
 */
async function getDb() {
  const { adminDb } = await import("./firebase-admin");
  return adminDb;
}

/** Coerces a Firestore document into a note, tolerating partially filled docs. */
function toNote(id: string, data: Record<string, unknown>): StoredNote {
  const asString = (value: unknown) =>
    typeof value === "string" ? value : "";

  return {
    id,
    title: asString(data.title),
    content: asString(data.content),
    category: asString(data.category) || undefined,
    createdAt: asString(data.createdAt),
    updatedAt: asString(data.updatedAt),
  };
}

/** All notes, newest update first. */
export async function listNotesServer(): Promise<StoredNote[]> {
  const db = await getDb();
  const snapshot = await db.collection("notes").get();

  return snapshot.docs
    .map((doc) => toNote(doc.id, doc.data()))
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export async function getNoteServer(id: string): Promise<StoredNote | null> {
  const db = await getDb();
  const doc = await db.collection("notes").doc(id).get();
  if (!doc.exists) return null;
  return toNote(doc.id, doc.data() ?? {});
}

/**
 * Applies the list endpoint's filters. Kept here (rather than as Firestore
 * queries) because the collection is small and a substring search across
 * title and content is not something Firestore can express anyway.
 */
export function filterNotes(
  notes: StoredNote[],
  { category, query }: { category?: string | null; query?: string | null },
): StoredNote[] {
  const wantedCategory = category?.trim().toLowerCase();
  const q = query?.trim().toLowerCase();

  return notes.filter((note) => {
    if (wantedCategory && noteCategory(note).toLowerCase() !== wantedCategory) {
      return false;
    }
    if (!q) return true;
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      noteCategory(note).toLowerCase().includes(q)
    );
  });
}
