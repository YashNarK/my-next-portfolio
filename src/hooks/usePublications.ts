import { useQuery } from "@tanstack/react-query";
import { IPublication } from "../../data/data.type";
import { AxiosError } from "axios";
import { getAllPublications } from "@/lib/firebase/publications-crud";

export const usePublications = () => {
  const { data, error, isLoading, isFetching } = useQuery<
    (IPublication & { id: string })[],
    AxiosError
  >({
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour,
    placeholderData: (previousData) => previousData,
    queryKey: ["publications"],
    queryFn: getAllPublications,
  });

  return {
    data: data,
    error: error?.message,
    isLoading: isLoading || isFetching,
  };
};

export default usePublications;
