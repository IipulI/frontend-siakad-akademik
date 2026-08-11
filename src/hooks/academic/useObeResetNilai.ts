import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export function useResetNilaiBeberapa(kelasId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rincianKrsIds: string[]) => {
      const response = await Api.post(`/akademik/kaprodi/kelas/${kelasId}/nilai/reset-beberapa`, { rincianKrsIds });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeKelasNilai", kelasId] });
    },
  });
}

export function useResetNilaiSemua(kelasId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await Api.delete(`/akademik/kaprodi/kelas/${kelasId}/nilai/reset-semua`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeKelasNilai", kelasId] });
    },
  });
}
