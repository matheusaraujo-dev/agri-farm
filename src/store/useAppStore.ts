import { create } from "zustand";
import { Producer, Farm, Harvest, Crop, DashboardData } from "../types";

interface AppState {
  // Dados
  producers: Producer[];
  farms: Farm[];
  harvests: Harvest[];
  crops: Crop[];

  // Estados de loading
  isLoading: boolean;

  updateProducer: (id: string, producer: Partial<Producer>) => void;
  deleteProducer: (id: string) => void;
  getProducerById: (id: string) => Producer | undefined;

  updateFarm: (id: string, farm: Partial<Farm>) => void;
  deleteFarm: (id: string) => void;
  getFarmById: (id: string) => Farm | undefined;
  getFarmsByProducerId: (producerId: string) => Farm[];

  // Actions para Safras
  addHarvest: (harvest: Omit<Harvest, "id" | "createdAt" | "crops">) => void;
  updateHarvest: (id: string, harvest: Partial<Harvest>) => void;
  deleteHarvest: (id: string) => void;
  getHarvestsByFarmId: (farmId: string) => Harvest[];

  // Actions para Culturas
  addCrop: (crop: Omit<Crop, "id">) => void;
  updateCrop: (id: string, crop: Partial<Crop>) => void;
  deleteCrop: (id: string) => void;

  // Dados do Dashboard
  getDashboardData: () => DashboardData;
}

const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export const useAppStore = create<AppState>((set, get) => ({
  producers: [],
  farms: [],
  harvests: [],
  crops: [],
  isLoading: false,

  updateProducer: (id, producerData) =>
    set((state) => ({
      producers: state.producers.map((producer) =>
        producer.id === id
          ? { ...producer, ...producerData, updatedAt: new Date() }
          : producer
      ),
    })),

  deleteProducer: (id) =>
    set((state) => {
      // Remove fazendas associadas ao produtor
      const farmsToDelete = state.farms.filter(
        (farm) => farm.producerId === id
      );
      const farmIds = farmsToDelete.map((farm) => farm.id);

      // Remove safras e culturas das fazendas
      const harvestsToDelete = state.harvests.filter((harvest) =>
        farmIds.includes(harvest.farmId)
      );
      const harvestIds = harvestsToDelete.map((harvest) => harvest.id);

      return {
        producers: state.producers.filter((producer) => producer.id !== id),
        farms: state.farms.filter((farm) => farm.producerId !== id),
        harvests: state.harvests.filter(
          (harvest) => !farmIds.includes(harvest.farmId)
        ),
        crops: state.crops.filter((crop) => !harvestIds.includes(crop.id)),
      };
    }),

  getProducerById: (id) =>
    get().producers.find((producer) => producer.id === id),

  updateFarm: (id, farmData) =>
    set((state) => ({
      farms: state.farms.map((farm) =>
        farm.id === id ? { ...farm, ...farmData, updatedAt: new Date() } : farm
      ),
    })),

  deleteFarm: (id) =>
    set((state) => {
      // Remove safras e culturas da fazenda
      const harvestsToDelete = state.harvests.filter(
        (harvest) => harvest.farmId === id
      );
      const harvestIds = harvestsToDelete.map((harvest) => harvest.id);

      return {
        farms: state.farms.filter((farm) => farm.id !== id),
        harvests: state.harvests.filter((harvest) => harvest.farmId !== id),
        crops: state.crops.filter((crop) => !harvestIds.includes(crop.id)),
      };
    }),

  getFarmById: (id) => get().farms.find((farm) => farm.id === id),

  getFarmsByProducerId: (producerId) =>
    get().farms.filter((farm) => farm.producerId === producerId),

  // Safras
  addHarvest: (harvestData) =>
    set((state) => ({
      harvests: [
        ...state.harvests,
        {
          ...harvestData,
          id: generateId(),
          crops: [],
          createdAt: new Date(),
        },
      ],
    })),

  updateHarvest: (id, harvestData) =>
    set((state) => ({
      harvests: state.harvests.map((harvest) =>
        harvest.id === id ? { ...harvest, ...harvestData } : harvest
      ),
    })),

  deleteHarvest: (id) =>
    set((state) => ({
      harvests: state.harvests.filter((harvest) => harvest.id !== id),
      crops: state.crops.filter((crop) => crop.id !== id),
    })),

  getHarvestsByFarmId: (farmId) =>
    get().harvests.filter((harvest) => harvest.farmId === farmId),

  // Culturas
  addCrop: (cropData) =>
    set((state) => ({
      crops: [
        ...state.crops,
        {
          ...cropData,
          id: generateId(),
        },
      ],
    })),

  updateCrop: (id, cropData) =>
    set((state) => ({
      crops: state.crops.map((crop) =>
        crop.id === id ? { ...crop, ...cropData } : crop
      ),
    })),

  deleteCrop: (id) =>
    set((state) => ({
      crops: state.crops.filter((crop) => crop.id !== id),
    })),

  // Dashboard
  getDashboardData: () => {
    const state = get();

    const totalFarms = state.farms.length;
    const totalHectares = state.farms.reduce(
      (total, farm) => total + farm.totalArea,
      0
    );

    // Fazendas por estado
    const farmsByState = state.farms.reduce((acc, farm) => {
      const existing = acc.find((item) => item.state === farm.state);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ state: farm.state, count: 1 });
      }
      return acc;
    }, [] as { state: string; count: number }[]);

    // Culturas plantadas
    const cropsByType = state.crops.reduce((acc, crop) => {
      const existing = acc.find((item) => item.crop === crop.name);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ crop: crop.name, count: 1 });
      }
      return acc;
    }, [] as { crop: string; count: number }[]);

    // Uso do solo
    const landUse = state.farms.reduce(
      (acc, farm) => ({
        arable: acc.arable + farm.cultivatedArea,
        vegetation: acc.vegetation + farm.vegetationArea,
      }),
      { arable: 0, vegetation: 0 }
    );

    return {
      totalFarms,
      totalHectares,
      farmsByState,
      cropsByType,
      landUse,
    };
  },
}));
