import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useBackendApi } from "./useBackendApi";

export function useProducers() {
  const { fetchProducers, createProducer, updateProducer, deleteProducer } =
    useBackendApi();
  const client = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["producers"],
    queryFn: fetchProducers,
    staleTime: 1000 * 10, // 10 seconds
  });

  const createProducerMutation = useMutation({
    mutationKey: ["createProducer"],
    mutationFn: createProducer,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["producers"],
        refetchType: "active",
      });
    },
  });

  const updateProducerMutation = useMutation({
    mutationKey: ["updateProducer"],
    mutationFn: updateProducer,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["producers"],
        refetchType: "active",
      });
    },
  });

  const deleteProducerMutation = useMutation({
    mutationKey: ["deleteProducer"],
    mutationFn: deleteProducer,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["producers"],
        refetchType: "active",
      });
    },
  });

  return {
    producers: data?.producers ?? [],
    isLoading,
    createProducerMutation,
    updateProducerMutation,
    deleteProducerMutation,
  };
}
