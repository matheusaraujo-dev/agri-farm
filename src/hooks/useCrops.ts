import { useQuery } from "@tanstack/react-query";

import { useBackendApi } from "./useBackendApi";

export function useCrops() {
  const { fetchCrops } = useBackendApi();

  const { data, isLoading } = useQuery({
    queryKey: ["crops"],
    queryFn: fetchCrops,
    staleTime: 1000 * 10, // 10 seconds
  });

  return { crops: data?.crops ?? [], isLoading };
}
