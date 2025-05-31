import { IPublication } from "../../data/data.type";
import { useCollection } from "./useCollection";

export const usePublications = () =>
  useCollection<IPublication>("publications");

export default usePublications;
