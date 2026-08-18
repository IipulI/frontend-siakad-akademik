import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface GraduateProfileData {
  id: string;
  kode: string;
  profil: string;
  deskripsi: string;
  deskripsiEn?: string;
  profesi?: string;
}

export interface GraduateProfilePayload {
  siakObeId: string;
  kode: string;
  profil: string;
  deskripsi: string;
  deskripsiEn?: string;
  profesi?: string;
}

export function getGraduateProfileData(obeId: string) {
  return useQuery({
    queryKey: ["graduateProfileData", obeId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      
      const response = await Api.get(`/akademik/obe/profil-lulusan/${obeId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      return response.data.data; // Mengembalikan { header, dataPl }
    },
    enabled: !!obeId,
  });
}

export function useAddGraduateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: GraduateProfilePayload) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.post("/akademik/obe/profil-lulusan", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfileData", variables.siakObeId] });
      queryClient.invalidateQueries({ queryKey: ["obeList"] });
    },
  });
}

export function useUpdateGraduateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obeId, data }: { id: string; obeId: string; data: Omit<GraduateProfilePayload, "siakObeId"> }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.put(`/akademik/obe/profil-lulusan/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfileData", variables.obeId] });
      queryClient.invalidateQueries({ queryKey: ["obeList"] });
    },
  });
}

export function useDeleteGraduateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obeId }: { id: string; obeId: string }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      await Api.delete(`/akademik/obe/profil-lulusan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfileData", variables.obeId] });
      queryClient.invalidateQueries({ queryKey: ["obeList"] });
    },
  });
}

// ---------- Salin Data PL ----------

export interface OpsiSalinPL {
  obeInfo: { tahunKurikulum: string; programStudi: string };
  opsiSumber: Array<{ obeId: string; tahunKurikulum: string; jumlahPL: number }>;
}

export function useOpsiSalinPL(obeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["opsiSalinPL", obeId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/obe/profil-lulusan/${obeId}/opsi-salin`);
      return response.data.data as OpsiSalinPL;
    },
    enabled,
  });
}

export function useSalinDataPL() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ obeId, sumberObeId }: { obeId: string; sumberObeId: string }) => {
      const response = await Api.post(`/akademik/obe/profil-lulusan/${obeId}/salin`, { sumberObeId });
      return response.data.data as { jumlahDisalin: number };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfileData", variables.obeId] });
    },
  });
}

// ---------- Template / Export / Import Excel PL ----------

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

export const downloadTemplatePL = (obeId: string) => downloadBlob(`/akademik/obe/profil-lulusan/${obeId}/template`, `Template_PL.xlsx`);
export const downloadDataPL = (obeId: string) => downloadBlob(`/akademik/obe/profil-lulusan/${obeId}/export`, `Data_PL.xlsx`);

export function useImportDataPL() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ obeId, file }: { obeId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await Api.post(`/akademik/obe/profil-lulusan/${obeId}/import`, formData);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfileData", variables.obeId] });
    },
  });
}
