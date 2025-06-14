import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useBackendApi } from "./useBackendApi";

export function useHarvests() {
  const client = useQueryClient();
  const {
    fetchHarvests,
    createHarvest,
    addCropToHarvest,
    updateCropToHarvest,
    deleteCropHarvest,
    deleteHarvest,
  } = useBackendApi();

  const harvestQueryKey = "harvests";

  const { data, isLoading } = useQuery({
    queryKey: [harvestQueryKey],
    queryFn: fetchHarvests,
    staleTime: 1000 * 10, // 10 seconds
  });

  const createHarvestMutation = useMutation({
    mutationKey: ["createHarvest"],
    mutationFn: createHarvest,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [harvestQueryKey],
        refetchType: "active",
      });
    },
  });

  const addCropsToHarvestMutation = useMutation({
    mutationKey: ["addCropToHarvest"],
    mutationFn: addCropToHarvest,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [harvestQueryKey],
        refetchType: "active",
      });
    },
  });

  const deleteCropsHarvestMutation = useMutation({
    mutationKey: ["deleteCropHarvest"],
    mutationFn: deleteCropHarvest,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [harvestQueryKey],
        refetchType: "active",
      });
    },
  });

  const deleteHarvestMutation = useMutation({
    mutationKey: ["deleteHarvest"],
    mutationFn: deleteHarvest,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [harvestQueryKey],
        refetchType: "active",
      });
    },
  });

  const updateCropsHarvestMutation = useMutation({
    mutationKey: ["updateCropHarvest"],
    mutationFn: updateCropToHarvest,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [harvestQueryKey],
        refetchType: "active",
      });
    },
  });

  return {
    harvests: data?.harvests ?? [],
    isLoading,
    createHarvestMutation,
    addCropsToHarvestMutation,
    updateCropsHarvestMutation,
    deleteCropsHarvestMutation,
    deleteHarvestMutation,
  };
}
