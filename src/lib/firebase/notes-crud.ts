import { INote } from "../../../data/data.type";
import { getAll, add, update, remove } from "./firestore-crud";

export const getAllNotes = () => getAll<INote>("notes");
export const addNote = (note: INote) => add<INote>("notes", note);
export const updateNote = (id: string, note: Partial<INote>) =>
  update<INote>("notes", id, note);
export const deleteNote = (id: string) => remove("notes", id);
