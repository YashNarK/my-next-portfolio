// hooks/useProjects.ts
import { getAllProjects } from "@/lib/firebase/firestore-crud";
import { useQuery } from "@tanstack/react-query";
import { IProject } from "../../data/data.type";
import { AxiosError } from "axios";

export const useProjects = () => {
  const { data, error, isLoading, isFetching } = useQuery<
    (IProject & { id: string })[],
    AxiosError
  >({
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour,
    placeholderData: (previousData) => previousData,
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  return {
    data: data,
    error: error?.message,
    isLoading: isLoading || isFetching,
  };
};

export default useProjects;
