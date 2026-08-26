import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface TemplateEvaluasiListItem {
  kurikulumId: string;
  tahunKurikulum: string;
  prodiId: string;
  kodeProdi: string;
  programStudi: string;
  jenisMataKuliah: string;
}

export interface TemplateEvaluasiListResult {
  total: number;
  items: TemplateEvaluasiListItem[];
  perPage: number;
  currentPage: number;
  totalPage: number;
}

// PENTING: field API "komponenEvaluasi" = kolom UI "Metode Evaluasi" (TUGAS/UTS/UAS/...),
// field API "metodeEvaluasi" = kolom UI "Jenis Evaluasi" (Aktivitas Partisipatif/Kognitif...).
// Penamaannya kebalik dari label UI -- ini dari backend, jangan diubah.
export interface TemplateKomponenItem {
  id?: string;
  komponenEvaluasi: string;
  metodeEvaluasi: string;
  bobot: number;
  syaratLulus: string;
}

export interface TemplateEvaluasiDetail {
  header: { tahunKurikulum: string; programStudi: string; jenisMataKuliah: string };
  komponen: TemplateKomponenItem[];
  pelaporan: Array<{ basisEvaluasi: string; komponenEvaluasi: string; bobotEvaluasi: string }>;
}

export interface TemplateEvaluasiFilters {
  kurikulumId?: string;
  prodiId?: string;
  jenisMk?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useTemplateEvaluasiList(filters: TemplateEvaluasiFilters) {
  return useQuery({
    queryKey: ["templateEvaluasiList", filters],
    queryFn: async () => {
      const params: Record<string, any> = {
        page: filters.page || 1,
        limit: filters.limit || 10,
      };
      if (filters.kurikulumId && filters.kurikulumId !== "all") params.kurikulumId = filters.kurikulumId;
      if (filters.prodiId && filters.prodiId !== "all") params.prodiId = filters.prodiId;
      if (filters.jenisMk && filters.jenisMk !== "all") params.jenisMk = filters.jenisMk;
      if (filters.search) params.search = filters.search;

      const response = await Api.get("/akademik/template-evaluasi", { params });
      // ResponseBuilder di backend otomatis membongkar payload {total, items} jadi
      // `data` (array polos) + `pagination` (objek terpisah) -- bukan {total, items, ...} utuh.
      const items = (response.data.data || []) as TemplateEvaluasiListItem[];
      const pagination = response.data.pagination || {};
      return {
        items,
        total: pagination.totalItems ?? items.length,
        perPage: pagination.perPage ?? filters.limit ?? 10,
        currentPage: pagination.currentPage ?? filters.page ?? 1,
        totalPage: pagination.totalPage ?? 1,
      } as TemplateEvaluasiListResult;
    },
  });
}

export function useTemplateEvaluasiDetail(kurikulumId: string, prodiId: string, jenisMk: string, enabled: boolean) {
  return useQuery({
    queryKey: ["templateEvaluasiDetail", kurikulumId, prodiId, jenisMk],
    queryFn: async () => {
      const response = await Api.get("/akademik/template-evaluasi/detail", {
        params: { kurikulumId, prodiId, jenisMk },
      });
      return response.data.data as TemplateEvaluasiDetail;
    },
    enabled,
  });
}

export interface SaveTemplatePayload {
  siakTahunKurikulumId: string;
  siakProgramStudiId: string;
  jenisMataKuliah: string;
  komponenData: Array<{ komponenEvaluasi: string; jenisEvaluasi: string; bobot: number; syaratLulus: string }>;
}

export function useSaveTemplateEvaluasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SaveTemplatePayload) => {
      const response = await Api.post("/akademik/template-evaluasi", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templateEvaluasiList"] });
      queryClient.invalidateQueries({ queryKey: ["templateEvaluasiDetail"] });
    },
  });
}

export function useDeleteTemplateEvaluasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ kurikulumId, prodiId, jenisMk }: { kurikulumId: string; prodiId: string; jenisMk: string }) => {
      const response = await Api.delete("/akademik/template-evaluasi", {
        params: { kurikulumId, prodiId, jenisMk },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templateEvaluasiList"] });
    },
  });
}

export interface PratinjauSalinTemplate {
  header: { tahunKurikulum: string; programStudi: string; jenisMataKuliah: string };
  komponen: Array<{ komponenEvaluasi: string; metodeEvaluasi: string; bobot: number; syaratLulus: string }>;
}

export async function fetchPratinjauSalinTemplateEvaluasi(prodiAsalId: string, kurikulumAsalId: string, jenisMkAsal: string) {
  const response = await Api.get("/akademik/template-evaluasi/pratinjau-salin", {
    params: { prodiAsalId, kurikulumAsalId, jenisMkAsal },
  });
  return response.data.data as PratinjauSalinTemplate;
}

export interface SalinTemplatePayload {
  prodiAsalId: string;
  kurikulumAsalId: string;
  jenisMkAsal: string;
  prodiTujuanId: string;
  kurikulumTujuanId: string;
  jenisMkTujuan: string;
}

export function useSalinTemplateEvaluasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SalinTemplatePayload) => {
      const response = await Api.post("/akademik/template-evaluasi/salin", payload);
      return response.data.data as { jumlahDisalin: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templateEvaluasiList"] });
    },
  });
}
