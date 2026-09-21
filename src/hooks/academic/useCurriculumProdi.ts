import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index.tsx";

interface AssignCurriculumProdiData {
  mataKuliahId: string;
  semester: number;
  nilaiMin: string;
  statusMk: "Wajib" | "Pilihan";
}

interface UpdateCurriculumProdiData {
  semester: number;
  statusMataKuliah: "Wajib" | "Pilihan";
  nilaiMinimal?: string;
  prasyaratData?: { mataKuliahId: string }[];
  konsentrasiIds?: string[];
}

// GET: daftar mata kuliah per semester untuk 1 prodi + 1 tahun kurikulum
export function useMataKuliahPerSemester(prodiId: string, tahunKurikulumId: string) {
  return useQuery({
    queryKey: ["mataKuliahPerSemester", prodiId, tahunKurikulumId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      }

      const response = await Api.get("/akademik/mata-kuliah-kurikulum/per-semester", {
        headers: { Authorization: `Bearer ${token}` },
        params: { prodiId, tahunKurikulumId },
      });

      return response.data?.data;
    },
    enabled: !!prodiId && !!tahunKurikulumId,
  });
}

// POST: assign mata kuliah ke semester tertentu dalam kurikulum
export function useAddCurriculumProdi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AssignCurriculumProdiData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      }

      const response = await Api.post("/akademik/mata-kuliah-kurikulum/assign", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mataKuliahPerSemester"] });
    },
    onError: (error: any) => {
      console.error("❌ Gagal menambahkan Mata Kuliah ke kurikulum:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
    },
  });
}

// PUT: ubah data mata kuliah dalam kurikulum (semester, status, nilai min, dst)
export function useUpdateCurriculumProdi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCurriculumProdiData }) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      }

      const response = await Api.put(`/akademik/mata-kuliah-kurikulum/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mataKuliahPerSemester"] });
    },
    onError: (error: any) => {
      console.error("❌ Gagal memperbarui Mata Kuliah dalam kurikulum:", error);
    },
  });
}

// DELETE: keluarkan mata kuliah dari kurikulum
export function useDeleteCurriculumProdi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      }

      const response = await Api.delete(`/akademik/mata-kuliah-kurikulum/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mataKuliahPerSemester"] });
    },
    onError: (error: any) => {
      console.error("❌ Gagal menghapus Mata Kuliah dari kurikulum:", error);
    },
  });
}
