import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index.tsx";

export interface SaveDetailRpsPayload {
  siakPeriodeAkademikId: string;
  tanggalPenyusunan: string;
  deskripsiMataKuliah: string;
  deskripsiMataKuliahEng?: string;
  tujuanMataKuliah: string;
  materiPembelajaran: string;
  pustakaUtama: string;
  pustakaPendukung: string;
  mediaPerangkatLunak?: string;
  mediaPerangkatKeras?: string;
  dokumenRps?: File | null;
}

export function useSaveDetailRps(mataKuliahId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveDetailRpsPayload) => {
      const formData = new FormData();
      formData.append("siakPeriodeAkademikId", payload.siakPeriodeAkademikId);
      formData.append("tanggalPenyusunan", payload.tanggalPenyusunan);
      formData.append("deskripsiMataKuliah", payload.deskripsiMataKuliah);
      formData.append("deskripsiMataKuliahEng", payload.deskripsiMataKuliahEng || "");
      formData.append("tujuanMataKuliah", payload.tujuanMataKuliah);
      formData.append("materiPembelajaran", payload.materiPembelajaran);
      formData.append("pustakaUtama", payload.pustakaUtama);
      formData.append("pustakaPendukung", payload.pustakaPendukung);
      formData.append("mediaPerangkatLunak", payload.mediaPerangkatLunak || "");
      formData.append("mediaPerangkatKeras", payload.mediaPerangkatKeras || "");
      if (payload.dokumenRps) {
        formData.append("dokumenRps", payload.dokumenRps);
      }

      const response = await Api.post(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/detail-rps`, formData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeDetailRps", mataKuliahId] });
    },
  });
}

export async function fetchPratinjauSalinDetailRps(mataKuliahId: string, periodeAsalId: string) {
  const response = await Api.get(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/detail-rps/pratinjau-salin`, {
    params: { periodeAsalId },
  });
  return response.data.data;
}

export function useSalinDetailRps(mataKuliahId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ periodeAsalId, periodeTujuanId }: { periodeAsalId: string; periodeTujuanId: string }) => {
      const response = await Api.post(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/detail-rps/salin`, {
        periodeAsalId,
        periodeTujuanId,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeDetailRps", mataKuliahId] });
    },
  });
}

export function useDeleteDetailRps(mataKuliahId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rpsId: string) => {
      const response = await Api.delete(`/akademik/koordinator-mk/detail-rps/${rpsId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeDetailRps", mataKuliahId] });
    },
  });
}
