// hooks/useProjects.ts
import { IProject } from "../../data/data.type";
import { useCollection } from "./useCollection";

export const useProjects = () => useCollection<IProject>("projects");

export default useProjects;
