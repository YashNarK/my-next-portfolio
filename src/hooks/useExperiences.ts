// hooks/useExperiences.ts
import { IExperience } from "../../data/data.type";
import { useCollection } from "./useCollection";

export const useExperiences = () => useCollection<IExperience>("experiences");

export default useExperiences;
