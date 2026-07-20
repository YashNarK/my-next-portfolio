import { useMemo } from "react";
import { ICredential } from "../../data/data.type";
import { useCollection } from "./useCollection";

const rank = (c: ICredential) =>
  typeof c.order === "number" ? c.order : Number.POSITIVE_INFINITY;

// Prioritized ordering: explicit `order` first (ascending), then the rest by
// most-recent issued date. Keeps the flagship Google/Microsoft badges pinned
// to the front regardless of date.
const sortCredentials = <T extends ICredential & { id: string }>(a: T, b: T) => {
  const ra = rank(a);
  const rb = rank(b);
  if (ra !== rb) return ra - rb;
  return (
    new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
  );
};

export const useCredentials = () => {
  const result = useCollection<ICredential>("credentials");
  const data = useMemo(
    () => (result.data ? [...result.data].sort(sortCredentials) : result.data),
    [result.data]
  );
  return { ...result, data };
};

export default useCredentials;
