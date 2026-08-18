import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ObeCplMkItem {
  id: string;
  kode: string;
  deskripsi: string;
  isMapped: boolean;
}

export function getPemetaanCplMk(mataKuliahId: string) {
  return useQuery({
    queryKey: ["pemetaanCplMk", mataKuliahId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/pemetaan-cpl`);
      const data = response.data.data;
      return {
        daftarCpl: (data?.daftarCpl || []) as ObeCplMkItem[],
        isObe: data?.isObe !== false,
      };
    },
    enabled: !!mataKuliahId,
  });
}

export function useSavePemetaanCplMk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mataKuliahId, cplIds }: { mataKuliahId: string; cplIds: string[] }) => {
      const response = await Api.post(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/pemetaan-cpl`, {
        cplIds,
      });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pemetaanCplMk", variables.mataKuliahId] });
      queryClient.invalidateQueries({ queryKey: ["pemetaanCpmk", variables.mataKuliahId] });
    },
  });
}
