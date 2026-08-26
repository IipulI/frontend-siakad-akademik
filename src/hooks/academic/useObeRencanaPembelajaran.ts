import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index.tsx";

export interface SaveSesiPayload {
  siakPeriodeAkademikId: string;
  sesi: number;
  jenisPertemuan: string;
  materiPembelajaran: string;
  materiPembelajaranEng?: string;
  indikatorPenilaian?: string;
  kriteriaPenilaian?: string;
  metodePembelajaranLuring?: string;
  metodePembelajaranDaring?: string;
  bobotPenilaian: number;
  cpmkIds: string[];
}

export function useCreateSesi(mataKuliahId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SaveSesiPayload) => {
      const response = await Api.post(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/rencana-pembelajaran`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeRencanaPembelajaran", mataKuliahId] });
    },
  });
}

export function useUpdateSesi(mataKuliahId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: SaveSesiPayload }) => {
      const response = await Api.put(`/akademik/koordinator-mk/rencana-pembelajaran/${id}`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeRencanaPembelajaran", mataKuliahId] });
    },
  });
}

export function useDeleteSesi(mataKuliahId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await Api.delete(`/akademik/koordinator-mk/rencana-pembelajaran/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeRencanaPembelajaran", mataKuliahId] });
    },
  });
}

export async function fetchDetailSesi(id: string) {
  const response = await Api.get(`/akademik/koordinator-mk/rencana-pembelajaran/${id}`);
  return response.data.data;
}

export async function downloadTemplateRencanaPembelajaran(mataKuliahId: string, namaMataKuliah: string) {
  const response = await Api.get(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/rencana-pembelajaran/template`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Template_Rencana_Pembelajaran_${namaMataKuliah}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export interface ImportRencanaPembelajaranResult {
  jumlahDiimport: number;
  detail: Array<{ sesi: number; jumlahCpmkDipetakan: number; kodeCpmkTidakDitemukan: string[] }>;
}

export function useImportRencanaPembelajaran(mataKuliahId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, siakPeriodeAkademikId }: { file: File; siakPeriodeAkademikId: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("siakPeriodeAkademikId", siakPeriodeAkademikId);
      const response = await Api.post(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/rencana-pembelajaran/import`, formData);
      return response.data.data as ImportRencanaPembelajaranResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeRencanaPembelajaran", mataKuliahId] });
    },
  });
}

export interface PratinjauSalinRencanaPembelajaran {
  periodeAsal: string;
  jumlahSesi: number;
  sesi: Array<{ sesi: number; jenisPertemuan: string; materiPembelajaran: string; bobotPenilaian: number; cpmk: string[] }>;
}

export async function fetchPratinjauSalinRencanaPembelajaran(mataKuliahId: string, periodeAsalId: string) {
  const response = await Api.get(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/rencana-pembelajaran/pratinjau-salin`, {
    params: { periodeAsalId },
  });
  return response.data.data as PratinjauSalinRencanaPembelajaran;
}

export function useSalinRencanaPembelajaran(mataKuliahId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ periodeAsalId, periodeTujuanId }: { periodeAsalId: string; periodeTujuanId: string }) => {
      const response = await Api.post(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/rencana-pembelajaran/salin`, {
        periodeAsalId,
        periodeTujuanId,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeRencanaPembelajaran", mataKuliahId] });
    },
  });
}
