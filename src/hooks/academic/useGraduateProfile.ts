import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";
export interface GraduateProfileData {
  id: string;
  programStudi: string;
  tahunKurikulum: string;
  profil: string;
  profesi: string;
  kodePl: string;
  deskripsiPl: string;
}

export interface GraduateProfilePayload {
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;

  kodePl: string;
  profil: string;
  profesi: string;
  deskripsiPl: string;
}

export function getGraduateProfileData(page: number, size: number) {
  return useQuery({
    queryKey: ["graduateProfileData", page, size],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await Api.get(`/akademik/profil-lulusan?page=${page}&size=${size}&sort=createdAt%2Cdesc`, { headers: { Authorization: `Bearer ${token}` } });

      return response.data.data;
    },
  });
}

export function useAddGraduateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGraduateProfileData: Omit<GraduateProfilePayload, "id">) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const payload = {
        siakProgramStudiId: newGraduateProfileData.siakProgramStudiId,
        siakTahunKurikulumId: newGraduateProfileData.siakTahunKurikulumId,
        kodePl: newGraduateProfileData.kodePl,
        profil: newGraduateProfileData.profil,
        profesi: newGraduateProfileData.profesi,
        deskripsiPl: newGraduateProfileData.deskripsiPl,
      };

      const response = await Api.post("/akademik/profil-lulusan", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newItemData = response.data?.data || response.data;
      return {
        id: newItemData.id,
        siakProgramStudiId: newItemData.siakProgramStudiId,
        siakTahunKurikulumId: newItemData.siakTahunKurikulumId,
        kodePl: newItemData.kodePl,
        profil: newItemData.profil,
        profesi: newItemData.profesi,
        deskripsiPl: newItemData.deskripsiPl,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfileData"] });
    },
  });
}

export function useUpdateGraduateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<GraduateProfilePayload, "id"> }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const payload = {
        siakProgramStudiId: data.siakProgramStudiId,
        siakTahunKurikulumId: data.siakTahunKurikulumId,
        kodePl: data.kodePl,
        profil: data.profil,
        profesi: data.profesi,
        deskripsiPl: data.deskripsiPl,
      };

      await Api.put(`/akademik/profil-lulusan/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfileData"] });
    },
  });
}

export function useDeleteGraduateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      await Api.delete(`/akademik/profil-lulusan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfileData"] });
    },
  });
}
