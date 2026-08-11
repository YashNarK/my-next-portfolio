import { doc, writeBatch } from "firebase/firestore";
import { INote } from "../../../data/data.type";
import { db } from "./firebase-client";
import { getAll, add, update, remove } from "./firestore-crud";

export const getAllNotes = () => getAll<INote>("notes");
export const addNote = (note: INote) => add<INote>("notes", note);
export const updateNote = (id: string, note: Partial<INote>) =>
  update<INote>("notes", id, note);
export const deleteNote = (id: string) => remove("notes", id);

/** Firestore refuses a batch with more writes than this. */
const MAX_BATCH_WRITES = 500;

/**
 * Sets the category on many notes at once — or clears it, when `category` is
 * an empty string, which drops those notes back into the "Uncategorized"
 * bucket.
 *
 * Batched rather than a loop of single updates so a bulk re-categorization is
 * one round trip per 500 notes, and so each chunk lands atomically instead of
 * leaving half the selection retagged if the network drops midway.
 *
 * Deliberately does not touch `updatedAt`: filing a note under a category is
 * housekeeping, not an edit to the note, and bumping it would reshuffle the
 * whole list (which sorts newest-first) and make every retagged note look like
 * it was rewritten today.
 */
export async function setNotesCategory(
  ids: string[],
  category: string,
): Promise<void> {
  for (let i = 0; i < ids.length; i += MAX_BATCH_WRITES) {
    const batch = writeBatch(db);
    for (const id of ids.slice(i, i + MAX_BATCH_WRITES)) {
      batch.update(doc(db, "notes", id), { category });
    }
    await batch.commit();
  }
}
