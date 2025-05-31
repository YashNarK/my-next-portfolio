import { IPublication } from "../../../data/data.type";
import { getAll, add, update, remove } from "./firestore-crud";

export const getAllPublications = () => getAll<IPublication>("publications");
export const addPublication = (publication: IPublication) =>
  add<IPublication>("publications", publication);
export const updatePublication = (
  id: string,
  publication: Partial<IPublication>
) => update<IPublication>("publications", id, publication);
export const deletePublication = (id: string) => remove("publications", id);
