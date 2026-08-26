import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface GrupMkOptions {
  kurikulum: Array<{ id: string; tahun: string; keterangan: string }>;
  grupMk: Array<{ id: string; nama: string; kode: string }>;
}

export function useGrupMkOptions() {
  return useQuery({
    queryKey: ["grupMkOptions"],
    queryFn: async () => {
      const response = await Api.get("/akademik/grup-mk/options");
      return response.data.data as GrupMkOptions;
    },
  });
}

export interface GrupMkTableItem {
  id: string;
  grupMk: string;
  mataKuliah: string;
  semester: number | string;
}

export interface GrupMkTableResult {
  items: GrupMkTableItem[];
  total: number;
  perPage: number;
  currentPage: number;
  totalPage: number;
}

export function useGrupMkTable(filters: { kurikulumId?: string; grupId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["grupMkTable", filters],
    queryFn: async () => {
      const params: Record<string, any> = { page: filters.page || 1, limit: filters.limit || 10 };
      if (filters.kurikulumId && filters.kurikulumId !== "all") params.kurikulumId = filters.kurikulumId;
      if (filters.grupId && filters.grupId !== "all") params.grupId = filters.grupId;

      const response = await Api.get("/akademik/grup-mk/datatable", { params });
      // ResponseBuilder membongkar payload paginated {total, items} jadi `data` (array polos)
      // + `pagination` (objek terpisah) -- pola yang sama kayak endpoint list lain.
      const items = (response.data.data || []) as GrupMkTableItem[];
      const pagination = response.data.pagination || {};
      return {
        items,
        total: pagination.totalItems ?? items.length,
        perPage: pagination.perPage ?? filters.limit ?? 10,
        currentPage: pagination.currentPage ?? filters.page ?? 1,
        totalPage: pagination.totalPage ?? 1,
      } as GrupMkTableResult;
    },
  });
}

export interface UnmappedMk {
  id: string;
  kode: string;
  nama: string;
  semester: number | string;
  sks: number;
}

export function useUnmappedMk(kurikulumId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["grupMkUnmapped", kurikulumId],
    queryFn: async () => {
      const response = await Api.get("/akademik/grup-mk/search-mk", { params: { kurikulumId } });
      return (response.data.data || []) as UnmappedMk[];
    },
    enabled,
  });
}

export function useSetGrupMk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ mkId, grupId }: { mkId: string; grupId: string }) => {
      const response = await Api.post("/akademik/grup-mk/set", { mkId, grupId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupMkTable"] });
      queryClient.invalidateQueries({ queryKey: ["grupMkUnmapped"] });
    },
  });
}

export function useRemoveGrupMk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mkId: string) => {
      const response = await Api.delete(`/akademik/grup-mk/remove/${mkId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupMkTable"] });
      queryClient.invalidateQueries({ queryKey: ["grupMkUnmapped"] });
    },
  });
}
