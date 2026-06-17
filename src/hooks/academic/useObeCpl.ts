import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ObeCplData {
  id: string;
  kode: string;
  deskripsi: string;
  kategori: string;
  profilLulusan?: Array<{ id: string; kode: string; profil: string }>;
  profilLulusanIds?: string[];
}

export interface ObeCplPayload {
  kode: string;
  deskripsi: string;
  kategori: string;
  profilLulusanIds: string[];
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

      const response = await Api.put(`/akademik/obe/capaian-pembelajaran/${id}`, payload, {
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
