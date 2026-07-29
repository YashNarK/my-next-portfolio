import { IChallenge } from "../../../data/data.type";
import { getAll, add, update, remove } from "./firestore-crud";

export const getAllChallenges = () => getAll<IChallenge>("challenges");
export const addChallenge = (challenge: IChallenge) =>
  add<IChallenge>("challenges", challenge);
export const updateChallenge = (id: string, challenge: Partial<IChallenge>) =>
  update<IChallenge>("challenges", id, challenge);
export const deleteChallenge = (id: string) => remove("challenges", id);
