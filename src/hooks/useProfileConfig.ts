import {
  getProfileConfig,
  updateProfileConfig,
  ProfileConfig,
} from "@/lib/firebase/site-config-crud";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = ["siteConfig", "profile"];

export function useProfileConfig() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<ProfileConfig>({
    queryKey: QUERY_KEY,
    queryFn: getProfileConfig,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: updateProfileConfig,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    profileConfig: data,
    isLoading,
    error: error?.message,
    updateProfileConfig: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}
