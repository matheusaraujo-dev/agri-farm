import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useBackendApi } from "./useBackendApi";

export function useFarms() {
  const { fetchFarms, createFarm, updateFarm, deleteFarm } = useBackendApi();
  const client = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["farms"],
    queryFn: fetchFarms,
    staleTime: 1000 * 10, // 10 seconds
  });

  const createFarmMutation = useMutation({
    mutationKey: ["createFarm"],
    mutationFn: createFarm,
    onSuccess: () => {
      client.invalidateQueries(
        { queryKey: ["farms"] }
      );
      client.invalidateQueries(
        { queryKey: ["fetchDashboard"] }
      );
    },
  });

  const updateFarmMutation = useMutation({
    mutationKey: ["updateFarm"],
    mutationFn: updateFarm,
    onSuccess: () => {
      client.invalidateQueries(
        { queryKey: ["farms"] }
      );
       client.invalidateQueries(
        { queryKey: ["fetchDashboard"] }
      );
    },
  });

  const deleteFarmMutation = useMutation({
    mutationKey: ["deleteFarm"],
    mutationFn: deleteFarm,
    onSuccess: () => {
      client.invalidateQueries(
        { queryKey: ["farms"] }
      );
       client.invalidateQueries(
        { queryKey: ["fetchDashboard"] }
      );
    },
  });

  return {
    farms: data?.farms ?? [],
    isLoading,
    createFarmMutation,
    updateFarmMutation,
    deleteFarmMutation,
  };
}
