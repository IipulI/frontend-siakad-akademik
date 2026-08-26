import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface CbtCpmkBobot {
  cpmkId: string;
  bobotPoin: number;
}

export interface CbtBreakdownItem {
  skorDiperoleh: number;
  skorMaksimal: number;
  pemetaanCpmk: CbtCpmkBobot[];
}

export interface CbtNilaiRow {
  krsId: string;
  breakdown: CbtBreakdownItem[];
}

export function getCbtNilai(rencanaEvaluasiId: string) {
  return useQuery({
    queryKey: ["cbtNilai", rencanaEvaluasiId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/cbt/komponen/${rencanaEvaluasiId}/nilai`);
      return (response.data.data?.daftarNilai || []) as CbtNilaiRow[];
    },
    enabled: !!rencanaEvaluasiId,
  });
}

export function useSyncCbtNilai(rencanaEvaluasiId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (daftarNilai: CbtNilaiRow[]) => {
      const response = await Api.post(`/akademik/cbt/komponen/${rencanaEvaluasiId}/nilai`, { daftarNilai });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cbtNilai", rencanaEvaluasiId] });
    },
  });
}

export function useResetCbtNilaiSiswa(rencanaEvaluasiId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (krsId: string) => {
      await Api.delete(`/akademik/cbt/komponen/${rencanaEvaluasiId}/nilai/${krsId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cbtNilai", rencanaEvaluasiId] });
    },
  });
}

export interface NilaiAkhirItem {
  krsId: string;
  nilaiAkhir: number;
}

export function useSyncNilaiAkhir() {
  return useMutation({
    mutationFn: async (daftarNilai: NilaiAkhirItem[]) => {
      const response = await Api.post(`/akademik/cbt/nilai-akhir`, { daftarNilai });
      return response.data.data;
    },
  });
}
