import { ICredential } from "../../data/data.type";
import { useCollection } from "./useCollection";

export const useCredentials = () => useCollection<ICredential>("credentials");

export default useCredentials;
