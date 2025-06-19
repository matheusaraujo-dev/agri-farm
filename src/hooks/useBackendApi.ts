import { axiosFactory } from "@/services/externalApi";
import { Crop, DashboardData, Farm, Harvest, Producer } from "@/types";
import { useCallback, useMemo } from "react";

interface InputCreateHarvest {
  farmId: string | number;
  name: string;
  baseYear: number;
}

interface InputCreateProducer {
  name: string;
  document: string;
}

interface InputCreateFarm {
  producerId: number;
  name: string;
  state: string;
  city: string;
  address: string;
  totalArea: number;
  cultivatedArea: number;
  vegetationArea: number;
}

interface InputUpdateFarm extends InputCreateFarm {
  farmId: number;
}

interface InputUpdateProducer extends InputCreateProducer {
  producerId: number;
}

interface InputAddCropToHarvest {
  farmId: number;
  harvestId: number;
  cropId: number;
}

interface InputDeleteCropToHarvest {
  farmId: number;
  harvestId: number;
  cropId: number;
}

interface InputDeleteHarvest {
  harvestId: number;
}

interface InputUpdateCropHarvest {
  farmId: number;
  harvestId: number;
  oldCropId: number;
  newCropId: number;
}

export function useBackendApi() {
  const baseURL =
    import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3333";

  const client = useMemo(() => axiosFactory(baseURL), [baseURL]);

  const fetchCrops = useCallback(async () => {
    const response = await client.get("/crops");
    return response.data as { crops: Crop[] };
  }, [client]);

  const fetchDashboard = useCallback(async () => {
    const response = await client.get("/dashboard_data");
    return response.data as DashboardData;
  }, [client]);

  const fetchProducers = useCallback(async () => {
    const response = await client.get("/producers");
    return response.data as { producers: Producer[] };
  }, [client]);

  const fetchFarms = useCallback(async () => {
    const response = await client.get("/farms");
    return response.data as { farms: Farm[] };
  }, [client]);

  const fetchHarvests = useCallback(async () => {
    const response = await client.get("/harvests");
    return response.data as { harvests: Harvest[] };
  }, [client]);

  const createHarvest = useCallback(
    async (input: InputCreateHarvest) => {
      const response = await client.post("/harvests", input);
      return response.data as { harvest: Omit<Harvest, "crop"> };
    },
    [client]
  );

  const addCropToHarvest = useCallback(
    async (input: InputAddCropToHarvest) => {
      const response = await client.post("/harvests/crops", input);
      return response.data as { message: string };
    },
    [client]
  );

  const deleteCropHarvest = useCallback(
    async (input: InputDeleteCropToHarvest) => {
      const response = await client.delete("/harvests/crops", { data: input });
      return response.data as { message: string };
    },
    [client]
  );

  const deleteHarvest = useCallback(
    async (input: InputDeleteHarvest) => {
      const response = await client.delete("/harvests", { data: input });
      return response.data as { message: string };
    },
    [client]
  );

  const updateCropToHarvest = useCallback(
    async (input: InputUpdateCropHarvest) => {
      const response = await client.put("/harvests/crops", input);
      return response.data as { message: string };
    },
    [client]
  );

  const createProducer = useCallback(
    async (input: InputCreateProducer) => {
      const response = await client.post("/producers", input);
      return response.data as { harvest: Producer };
    },
    [client]
  );

  const createFarm = useCallback(
    async (input: InputCreateFarm) => {
      const response = await client.post("/farms", input);
      return response.data as { farm: Farm };
    },
    [client]
  );

  const updateFarm = useCallback(
    async (input: InputUpdateFarm) => {
      const response = await client.put(`/farms/${input.farmId}`, input);
      return response.data as { message: string };
    },
    [client]
  );

  const updateProducer = useCallback(
    async (input: InputUpdateProducer) => {
      const response = await client.put(
        `/producers/${input.producerId}`,
        input
      );
      return response.data as { message: string };
    },
    [client]
  );

  const deleteProducer = useCallback(
    async (producerId: number) => {
      const response = await client.delete(`/producers/${producerId}`);
      return response.data as { message: string };
    },
    [client]
  );

  const deleteFarm = useCallback(
    async (farmId: number) => {
      const response = await client.delete(`/farms/${farmId}`);
      return response.data as { message: string };
    },
    [client]
  );
  return {
    addCropToHarvest,
    createFarm,
    createHarvest,
    createProducer,

    deleteCropHarvest,
    deleteFarm,
    deleteHarvest,
    deleteProducer,

    fetchCrops,
    fetchDashboard,
    fetchFarms,
    fetchHarvests,
    fetchProducers,

    updateCropToHarvest,
    updateFarm,
    updateProducer,
  };
}
