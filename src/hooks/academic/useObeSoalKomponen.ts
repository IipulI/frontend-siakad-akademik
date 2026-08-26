import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export type JenisUnit = "RUBRIK" | "OBJEKTIF";

export interface ObeOpsiJawaban {
  label: string;
  teks: string;
}

export interface ObeSoalCpmkPemetaan {
  cpmkId: string;
  bobotPoin: number;
}

export interface ObeSoalItem {
  id: string;
  nomor: number;
  label?: string;
  jenisUnit: JenisUnit;
  skorMaksimal: number;
  pertanyaan?: string;
  kunciJawaban?: string;
  opsiJawaban?: ObeOpsiJawaban[];
  pemetaanCpmk?: ObeSoalCpmkPemetaan[];
  parentSoalId?: string | null;
}

export function getSoalKomponen(rencanaEvaluasiId: string) {
  return useQuery({
    queryKey: ["soalKomponen", rencanaEvaluasiId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/soal/komponen/${rencanaEvaluasiId}`);
      const data = response.data.data || {};
      return { daftarSoal: (data.daftarSoal || []) as ObeSoalItem[] };
    },
    enabled: !!rencanaEvaluasiId,
  });
}

export interface DraftSoalItem {
  nomor: number;
  label?: string;
  jenisUnit: JenisUnit;
  skorMaksimal: number;
  pertanyaan?: string;
  kunciJawaban?: string;
  opsiJawaban?: ObeOpsiJawaban[];
  pemetaanCpmk?: ObeSoalCpmkPemetaan[];
  parentSoalNomor?: number;
  parentSoalId?: string;
}

export function useBatchCreateSoal(rencanaEvaluasiId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (daftarSoal: DraftSoalItem[]) => {
      const response = await Api.post(`/akademik/soal/komponen/${rencanaEvaluasiId}/batch`, { daftarSoal });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soalKomponen", rencanaEvaluasiId] });
    },
  });
}

export function useUpdateSoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ soalId, rencanaEvaluasiId, payload }: { soalId: string; rencanaEvaluasiId: string; payload: DraftSoalItem }) => {
      const response = await Api.put(`/akademik/soal/${soalId}`, payload);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["soalKomponen", variables.rencanaEvaluasiId] });
    },
  });
}

export function useDeleteSoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ soalId }: { soalId: string; rencanaEvaluasiId: string }) => {
      await Api.delete(`/akademik/soal/${soalId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["soalKomponen", variables.rencanaEvaluasiId] });
    },
  });
}

export interface NilaiSoalItem {
  soalId: string;
  jawabanMahasiswa?: string;
  skor?: number;
}

export function useSubmitNilaiSoal() {
  return useMutation({
    mutationFn: async ({ krsId, nilaiSoal }: { krsId: string; nilaiSoal: NilaiSoalItem[] }) => {
      const response = await Api.post(`/akademik/soal/nilai/${krsId}`, { nilaiSoal });
      return response.data.data;
    },
  });
}
