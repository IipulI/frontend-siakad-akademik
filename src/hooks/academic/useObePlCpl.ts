import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ObePlCplBobot {
  cplId: string;
  kodeCpl: string;
  bobot: number;
}

export interface ObePlCplRow {
  id: string;
  kode: string;
  profil: string;
  bobotCpl: ObePlCplBobot[];
}

export interface ObePlCplColumn {
  id: string;
  kode: string;
}

export interface ObePlCplMappingData {
  columns: ObePlCplColumn[];
  rows: ObePlCplRow[];
}

export function getObePlCplMapping(obeId: string) {
  return useQuery({
    queryKey: ["obePlCplMapping", obeId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.get(`/akademik/obe/pemetaan/pl-ke-cpl/${obeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data as ObePlCplMappingData;
      return {
        columns: data?.columns || [],
        rows: data?.rows || [],
      };
    },
    enabled: !!obeId,
  });
}

export interface ObePlCplPemetaanItem {
  plId: string;
  cplId: string;
  bobot: number;
}

export function useSaveObePlCplMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ obeId, pemetaan }: { obeId: string; pemetaan: ObePlCplPemetaanItem[] }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.post(
        `/akademik/obe/pemetaan/pl-ke-cpl/${obeId}`,
        { pemetaan },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obePlCplMapping", variables.obeId] });
      queryClient.invalidateQueries({ queryKey: ["obeList"] });
    },
  });
}

// ---------- Salin Data Pemetaan PL -> CPL ----------

export interface OpsiSalinPlCpl {
  obeInfo: { tahunKurikulum: string; programStudi: string };
  opsiSumber: Array<{ obeId: string; tahunKurikulum: string; jumlahPemetaan: number }>;
}

export function useOpsiSalinPlCpl(obeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["opsiSalinPlCpl", obeId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/obe/pemetaan/pl-ke-cpl/${obeId}/opsi-salin`);
      return response.data.data as OpsiSalinPlCpl;
    },
    enabled,
  });
}

export interface PratinjauSalinPlCplItem {
  kodePL: string;
  profilPL: string;
  pemetaanCpl: Array<{ kodeCPL: string; bobot: number }>;
}

export async function fetchPratinjauSalinPlCpl(obeId: string, sumberObeId: string) {
  const response = await Api.get(`/akademik/obe/pemetaan/pl-ke-cpl/${obeId}/pratinjau-salin`, { params: { sumberObeId } });
  return response.data.data as PratinjauSalinPlCplItem[];
}

export function useSalinPlCpl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ obeId, sumberObeId }: { obeId: string; sumberObeId: string }) => {
      const response = await Api.post(`/akademik/obe/pemetaan/pl-ke-cpl/${obeId}/salin`, { sumberObeId });
      return response.data.data as { jumlahDisalin: number; jumlahDilewati: number };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obePlCplMapping", variables.obeId] });
    },
  });
}
