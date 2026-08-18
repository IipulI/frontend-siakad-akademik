import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface CplUmumHeader {
  kurikulum: string;
  keterangan: string;
  mulaiBerlaku: string;
  tanggalAwal: string;
  tanggalAkhir: string;
}

export interface CplUmumRow {
  id: string;
  kode: string;
  deskripsiInd: string;
  deskripsiEng: string;
  targetCpl: number;
  kategori: string;
  siakFakultasId: string | null;
  tingkatCpl: string;
}

export interface CplUmumListResult {
  header: CplUmumHeader;
  tabel: CplUmumRow[];
}

export function useCplUmumManagementList(
  tahunKurikulumId: string,
  filters: { search?: string; kategori?: string },
  enabled: boolean
) {
  return useQuery({
    queryKey: ["cplUmumManagement", tahunKurikulumId, filters],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (filters.search) params.search = filters.search;
      if (filters.kategori && filters.kategori !== "all") params.kategori = filters.kategori;

      const response = await Api.get(`/akademik/cpl-umum/${tahunKurikulumId}`, { params });
      // Field baris datanya "tabel", bukan "data" -- lihat services/cpl-umum.service.js.
      return response.data.data as CplUmumListResult;
    },
    enabled,
  });
}

export interface OpsiTingkatCpl {
  id: string | null;
  nama: string;
}

export function useOpsiTingkatCpl() {
  return useQuery({
    queryKey: ["opsiTingkatCpl"],
    queryFn: async () => {
      const response = await Api.get(`/akademik/cpl-umum/opsi/tingkat-cpl`);
      return response.data.data as OpsiTingkatCpl[];
    },
  });
}

export interface SaveCplUmumPayload {
  id?: string;
  kode: string;
  deskripsiInd: string;
  deskripsiEng: string;
  targetCpl: number;
  kategori: string;
  siakFakultasId: string | null;
}

export function useSaveCplUmum(tahunKurikulumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SaveCplUmumPayload) => {
      const response = await Api.post(`/akademik/cpl-umum/${tahunKurikulumId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cplUmumManagement", tahunKurikulumId] });
    },
  });
}

export function useDeleteCplUmum(tahunKurikulumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cplUmumId: string) => {
      const response = await Api.delete(`/akademik/cpl-umum/${cplUmumId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cplUmumManagement", tahunKurikulumId] });
    },
  });
}
