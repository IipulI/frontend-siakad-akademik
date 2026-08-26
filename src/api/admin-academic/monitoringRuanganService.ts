// src/api/admin-academic/monitoringRuanganService.ts
import { Api } from "../Index";
import { IMonitoringRuanganResponse } from "../../types/monitoringRuang.types";

const ENDPOINT = "/akademik/ruangan/monitoring";

export interface MonitoringRuanganParams {
  tanggal: string; // "YYYY-MM-DD"
  fakultasId?: string;
  programStudiId?: string;
  dosenId?: string;
  kapasitasMin?: number;
  search?: string;
  page?: number;
  size?: number;
}

export const monitoringRuanganService = {
  /**
   * Mengambil data pemakaian ruangan pada suatu tanggal.
   * GET /akademik/ruangan/monitoring
   */
  getAll: async (
    params: MonitoringRuanganParams
  ): Promise<IMonitoringRuanganResponse> => {
    const query: Record<string, string | number> = {
      tanggal: params.tanggal,
      page: params.page ?? 1,
      size: params.size ?? 100,
    };
    if (params.fakultasId) query.fakultasId = params.fakultasId;
    if (params.programStudiId) query.programStudiId = params.programStudiId;
    if (params.dosenId) query.dosenId = params.dosenId;
    if (params.kapasitasMin) query.kapasitasMin = params.kapasitasMin;
    if (params.search?.trim()) query.search = params.search.trim();

    const response = await Api.get<{ data: IMonitoringRuanganResponse }>(
      ENDPOINT,
      { params: query }
    );
    return response.data.data;
  },
};
