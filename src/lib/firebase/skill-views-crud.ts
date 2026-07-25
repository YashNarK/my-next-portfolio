import { ISkillView } from "../../../data/data.type";
import { getAll, add, update, remove } from "./firestore-crud";

export const getAllSkillViews = () => getAll<ISkillView>("skillViews");
export const addSkillView = (view: ISkillView) =>
  add<ISkillView>("skillViews", view);
export const updateSkillView = (id: string, view: Partial<ISkillView>) =>
  update<ISkillView>("skillViews", id, view);
export const deleteSkillView = (id: string) => remove("skillViews", id);
