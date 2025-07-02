import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface CurriculumData {
  id: string;
  mulaiBerlaku: string;
  tahun: string;
  keterangan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  siakPeriodeAkademikId: string;
}

// --- queries ---
export function getCurriculumYear() {
  return useQuery({
    queryKey: ["curriculumData"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await Api.get("/akademik/tahun-kurikulum", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
  });
}

// --- mutation for add curriculum ---
export function useAddCurriculumYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCurriculumData: Omit<CurriculumData, "id">) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const payload = {
        siakPeriodeAkademikId: newCurriculumData.siakPeriodeAkademikId,
        tahun: newCurriculumData.tahun,
        keterangan: newCurriculumData.keterangan,
        tanggalMulai: newCurriculumData.tanggalMulai,
        tanggalSelesai: newCurriculumData.tanggalSelesai,
      };

      const response = await Api.post("/akademik/tahun-kurikulum", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newItemData = response.data?.data || response.data;
      return {
        id: newItemData.id,
        tahun: newItemData.tahun,
        keterangan: newItemData.keterangan,
        mulaiBerlaku: newItemData.mulaiBerlaku,
        siakPeriodeAkademikId: newItemData.siakPeriodeAkademikId,
        tanggalMulai: newItemData.tanggalMulai,
        tanggalSelesai: newItemData.tanggalSelesai,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculumData"] });
    },
  });
}

// --- mutation for update curriculum ---
export function useUpdateCurriculumYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<CurriculumData, "id"> }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const payload = {
        siakPeriodeAkademikId: data.siakPeriodeAkademikId,
        tahun: data.tahun,
        keterangan: data.keterangan,
        tanggalMulai: data.tanggalMulai,
        tanggalSelesai: data.tanggalSelesai,
      };

      await Api.put(`/akademik/tahun-kurikulum/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculumData"] });
    },
  });
}

// --- mutation for delete curriculum ---
export function useDeleteCurriculumYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      await Api.delete(`/akademik/tahun-kurikulum/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculumData"] });
    },
  });
}
