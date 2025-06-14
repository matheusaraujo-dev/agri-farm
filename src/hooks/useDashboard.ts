import { useQuery } from "@tanstack/react-query";

import { useBackendApi } from "./useBackendApi";
import { DashboardData } from "@/types";

export function useDashboard() {
  const { fetchDashboard } = useBackendApi();

  const initialDashboardData: DashboardData = {
    landUse: {
      arable: 0,
      vegetation: 0,
    },
    totalHectares: 0,
    cropsGrouped: [],
    farmsByState: [],
    totalFarms: 0,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fetchDashboard"],
    queryFn: fetchDashboard,
    initialData: initialDashboardData,
     staleTime: 1000 * 20, // 10 seconds
  });

  return { dashboardData: data, isLoading };
}
