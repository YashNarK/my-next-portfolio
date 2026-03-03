import {
  getResumeConfig,
  updateResumeConfig,
  ResumeConfig,
} from "@/lib/firebase/site-config-crud";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = ["siteConfig", "resume"];

export function useResumeConfig() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<ResumeConfig>({
    queryKey: QUERY_KEY,
    queryFn: getResumeConfig,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: updateResumeConfig,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    resumeConfig: data,
    isLoading,
    error: error?.message,
    updateResumeConfig: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}
