import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export type SyaratLulus =
  | "TIDAK_MENJADI_SYARAT_LULUS"
  | "MENJADI_SYARAT_LULUS"
  | "LULUS_DENGAN_NILAI_MINIMUM";

export interface ObeRencanaEvaluasiItem {
  id: string;
  metodeEvaluasi: string;
  jenisEvaluasi: string;
  bobotEvaluasi: number;
  mappingBobotCpmk: Record<string, number>;
  syaratLulus: SyaratLulus;
}

export interface ObeMasterCpmk {
  id: string;
  kode: string;
  deskripsi?: string;
}

export function getRencanaEvaluasi(mataKuliahId: string, periodeId: string) {
  return useQuery({
    queryKey: ["rencanaEvaluasi", mataKuliahId, periodeId],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/rencana-evaluasi`,
        { params: { periodeId } }
      );
      const data = response.data.data || {};
      return {
        rencanaEvaluasi: (data.rencanaEvaluasi || []) as ObeRencanaEvaluasiItem[],
        masterCpmk: (data.masterCpmk || []) as ObeMasterCpmk[],
      };
    },
    enabled: !!mataKuliahId && !!periodeId,
  });
}

export interface SaveEvaluasiListItem {
  metodeEvaluasi: string;
  jenisEvaluasi: string;
  bobotEvaluasi: number;
  cpmkData: { cpmkId: string; bobotCpmk: number }[];
  syaratLulus: SyaratLulus;
}

export function useSaveRencanaEvaluasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mataKuliahId,
      siakPeriodeAkademikId,
      evaluasiList,
    }: {
      mataKuliahId: string;
      siakPeriodeAkademikId: string;
      evaluasiList: SaveEvaluasiListItem[];
    }) => {
      const response = await Api.post(
        `/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/rencana-evaluasi`,
        { siakPeriodeAkademikId, evaluasiList }
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rencanaEvaluasi", variables.mataKuliahId, variables.siakPeriodeAkademikId],
      });
    },
  });
}
