import { ISkill } from "../../data/data.type";
import { useCollection } from "./useCollection";

export const useSkills = () => useCollection<ISkill>("skills");

export default useSkills;
