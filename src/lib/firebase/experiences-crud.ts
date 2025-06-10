import { IExperience } from "../../../data/data.type";
import { getAll, add, update, remove } from "./firestore-crud";

export const getAllExperiences = () => getAll<IExperience>("experiences");
export const addExperience = (experience: IExperience) =>
  add<IExperience>("experiences", experience);
export const updateExperience = (
  id: string,
  experience: Partial<IExperience>
) => update<IExperience>("experiences", id, experience);
export const deleteExperience = (id: string) => remove("experiences", id);
