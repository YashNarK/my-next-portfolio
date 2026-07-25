import { ISkill } from "../../../data/data.type";
import { getAll, add, update, remove } from "./firestore-crud";

export const getAllSkills = () => getAll<ISkill>("skills");
export const addSkill = (skill: ISkill) => add<ISkill>("skills", skill);
export const updateSkill = (id: string, skill: Partial<ISkill>) =>
  update<ISkill>("skills", id, skill);
export const deleteSkill = (id: string) => remove("skills", id);
