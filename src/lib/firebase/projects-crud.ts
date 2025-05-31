import { IProject } from "../../../data/data.type";
import { getAll, add, update, remove } from "./firestore-crud";

export const getAllProjects = () => getAll<IProject>("projects");
export const addProject = (project: IProject) =>
  add<IProject>("projects", project);
export const updateProject = (id: string, project: Partial<IProject>) =>
  update<IProject>("projects", id, project);
export const deleteProject = (id: string) => remove("projects", id);
