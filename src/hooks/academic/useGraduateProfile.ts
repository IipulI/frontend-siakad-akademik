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
