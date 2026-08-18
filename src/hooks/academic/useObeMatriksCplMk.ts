import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface MatriksCplMkColumn {
  id: string;
  kode: string;
}

export interface MatriksCplMkCell {
  cplId: string;
  kodeCpl: string;
  isMapped: boolean;
}

export interface MatriksCplMkRow {
  id: string;
  semester: number | string;
  kode: string;
  nama: string;
  sks: number;
  isMku: boolean;
  isLengkap: boolean;
  pemetaanCpl: MatriksCplMkCell[];
}

export interface MatriksCplMkResult {
  header: { kodeProdi: string; programStudi: string; tahunKurikulum: string };
  columns: MatriksCplMkColumn[];
  rows: MatriksCplMkRow[];
}

export function getMatriksCplMk(obeId: string) {
  return useQuery({
    queryKey: ["matriksCplMk", obeId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/obe/pemetaan/cpl-ke-mk/${obeId}`);
      return response.data.data as MatriksCplMkResult;
    },
    enabled: !!obeId,
  });
}

export interface PemetaanCplMkItem {
  mkId: string;
  cplId: string;
}

export function useSaveMatriksCplMk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ obeId, pemetaan }: { obeId: string; pemetaan: PemetaanCplMkItem[] }) => {
      const response = await Api.post(`/akademik/obe/pemetaan/cpl-ke-mk/${obeId}`, { pemetaan });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["matriksCplMk", variables.obeId] });
      queryClient.invalidateQueries({ queryKey: ["obeList"] });
    },
  });
}

// ---------- Salin Data Pemetaan CPL -> MK ----------

export interface OpsiSalinCplMk {
  obeInfo: { tahunKurikulum: string; programStudi: string };
  opsiSumber: Array<{ obeId: string; tahunKurikulum: string; jumlahPemetaan: number }>;
}

export function useOpsiSalinCplMk(obeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["opsiSalinCplMk", obeId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/obe/pemetaan/cpl-ke-mk/${obeId}/opsi-salin`);
      return response.data.data as OpsiSalinCplMk;
    },
    enabled,
  });
}

export interface PratinjauSalinCplMkItem {
  kodeCPL: string;
  mataKuliah: Array<{ kodeMK: string; namaMK: string }>;
}

export async function fetchPratinjauSalinCplMk(obeId: string, sumberObeId: string) {
  const response = await Api.get(`/akademik/obe/pemetaan/cpl-ke-mk/${obeId}/pratinjau-salin`, { params: { sumberObeId } });
  return response.data.data as PratinjauSalinCplMkItem[];
}

export function useSalinCplMk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ obeId, sumberObeId }: { obeId: string; sumberObeId: string }) => {
      const response = await Api.post(`/akademik/obe/pemetaan/cpl-ke-mk/${obeId}/salin`, { sumberObeId });
      return response.data.data as { jumlahDisalin: number; jumlahDilewati: number };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["matriksCplMk", variables.obeId] });
    },
  });
}

// ---------- Laporan Pemetaan CPL -> MK (Cetak) ----------

export interface LaporanCplMkItem {
  kodeCpl: string;
  total: number;
  mks: Array<{
    kodeMk: string;
    namaMk: string;
    semester: number | string;
    sks: number;
    isMku: boolean;
    cpmks: Array<{ kodeCpmk: string; bobot: number }>;
  }>;
}

export function useLaporanCplMk(obeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["laporanCplMk", obeId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/obe/pemetaan/cpl-ke-mk/${obeId}/pratinjau-pdf`);
      return response.data.data as { header: { programStudi: string; tahunKurikulum: string }; data: LaporanCplMkItem[] };
    },
    enabled,
  });
}
