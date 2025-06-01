import { ICredential } from "../../../data/data.type";
import { getAll, add, update, remove } from "./firestore-crud";

export const getAllCredentials = () => getAll<ICredential>("credentials");
export const addCredential = (credential: ICredential) =>
  add<ICredential>("credentials", credential);
export const updateCredential = (
  id: string,
  credential: Partial<ICredential>
) => update<ICredential>("credentials", id, credential);
export const deleteCredential = (id: string) => remove("credentials", id);
