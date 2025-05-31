import { getAll } from "@/lib/firebase/firestore-crud";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCollection = <T>(
  collectionName: string,
  options?: Partial<
    UseQueryOptions<(T & { id: string })[], AxiosError, (T & { id: string })[]>
  >
) => {
  const { data, error, isLoading, isFetching } = useQuery<
    (T & { id: string })[],
    AxiosError
  >({
    queryKey: [collectionName],
    queryFn: () => getAll<T>(collectionName),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    placeholderData: (prev) => prev,
    ...options,
  });

  return {
    data,
    error: error?.message,
    isLoading: isLoading || isFetching,
  };
};
