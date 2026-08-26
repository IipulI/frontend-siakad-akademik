import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ObeCplData {
  id: string;
  kode: string;
  deskripsi: string;
  deskripsiEn?: string;
  kategori: string;
  targetCpl?: number;
}

export interface ObeCplPayload {
  kode: string;
  deskripsi: string;
  deskripsiEn?: string;
  kategori: string;
  targetCpl: number;
}

export function getObeCplData(obeId: string) {
  return useQuery({
    queryKey: ["obeCplData", obeId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      
      const response = await Api.get(`/akademik/obe/capaian-pembelajaran/${obeId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      return response.data.data; // Mengembalikan { header, dataCpl } atau array
    },
    enabled: !!obeId,
  });
}

export function useAddObeCpl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ obeId, payload }: { obeId: string; payload: ObeCplPayload }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.post(`/akademik/obe/capaian-pembelajaran/${obeId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obeCplData", variables.obeId] });
      queryClient.invalidateQueries({ queryKey: ["obeList"] });
    },
  });
}

export function useUpdateObeCpl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obeId, payload }: { id: string; obeId: string; payload: ObeCplPayload }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.put(`/akademik/obe/${obeId}/capaian-pembelajaran/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obeCplData", variables.obeId] });
      queryClient.invalidateQueries({ queryKey: ["obeList"] });
    },
  });
}

export function useUpdateObeCplTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obeId, targetCpl }: { id: string; obeId: string; targetCpl: number }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.patch(`/akademik/obe/capaian-pembelajaran/${id}/target`, { targetCpl }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obeCplData", variables.obeId] });
      queryClient.invalidateQueries({ queryKey: ["obeList"] });
    },
  });
}

export function useDeleteObeCpl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obeId }: { id: string; obeId: string }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      await Api.delete(`/akademik/obe/capaian-pembelajaran/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obeCplData", variables.obeId] });
      queryClient.invalidateQueries({ queryKey: ["obeList"] });
    },
  });
}

// ---------- Salin Data CPL ----------

export interface OpsiSalinCPL {
  obeInfo: { tahunKurikulum: string; programStudi: string };
  opsiSumber: Array<{ obeId: string; tahunKurikulum: string; jumlahCPL: number }>;
}

export function useOpsiSalinCPL(obeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["opsiSalinCPL", obeId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/obe/capaian-pembelajaran/${obeId}/opsi-salin`);
      return response.data.data as OpsiSalinCPL;
    },
    enabled,
  });
}

export function useSalinDataCPL() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ obeId, sumberObeId }: { obeId: string; sumberObeId: string }) => {
      const response = await Api.post(`/akademik/obe/capaian-pembelajaran/${obeId}/salin`, { sumberObeId });
      return response.data.data as { jumlahDisalin: number };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obeCplData", variables.obeId] });
    },
  });
}

// ---------- Template / Export / Import Excel CPL ----------

async function downloadBlob(path: string, filename: string) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Gagal mengunduh file (status ${response.status})`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const downloadTemplateCPL = (obeId: string) => downloadBlob(`/akademik/obe/capaian-pembelajaran/${obeId}/template`, `Template_CPL.xlsx`);
export const downloadDataCPL = (obeId: string) => downloadBlob(`/akademik/obe/capaian-pembelajaran/${obeId}/export`, `Data_CPL.xlsx`);

export function useImportDataCPL() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ obeId, file }: { obeId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await Api.post(`/akademik/obe/capaian-pembelajaran/${obeId}/import`, formData);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obeCplData", variables.obeId] });
    },
  });
}

// ---------- CPL Umum ----------

export interface CplUmumItem {
  id: string;
  kode: string;
  deskripsiInd: string;
  deskripsiEng: string;
  targetCpl: number;
  kategori: string;
  tingkatCpl: string;
}

export function useCplUmum(tahunKurikulumId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["cplUmum", tahunKurikulumId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/cpl-umum/${tahunKurikulumId}`);
      // Field baris datanya "tabel", bukan "data" -- lihat services/cpl-umum.service.js.
      return response.data.data as { header: any; tabel: CplUmumItem[] };
    },
    enabled,
  });
}

export function useAmbilCplUmum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ obeId, cplUmumIds }: { obeId: string; cplUmumIds: string[] }) => {
      const response = await Api.post(`/akademik/obe/capaian-pembelajaran/${obeId}/ambil-cpl-umum`, { cplUmumIds });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obeCplData", variables.obeId] });
    },
  });
}
