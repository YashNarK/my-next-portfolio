import { ISkillView } from "../../data/data.type";
import { useCollection } from "./useCollection";

export const useSkillViews = () => useCollection<ISkillView>("skillViews");

export default useSkillViews;
