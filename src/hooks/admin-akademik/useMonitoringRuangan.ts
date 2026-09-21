import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  monitoringRuanganService,
  MonitoringRuanganParams,
} from "../../api/admin-academic/monitoringRuanganService";

export function useMonitoringRuangan(params: MonitoringRuanganParams) {
  return useQuery({
    queryKey: ["monitoringRuangan", params],
    queryFn: () => monitoringRuanganService.getAll(params),
    enabled: !!params.tanggal,
    placeholderData: keepPreviousData,
  });
}
