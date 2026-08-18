import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ObeCplHeader {
  id: string;
  kode: string;
  kodeCpl?: string;
}

export interface ObeCplPemetaanItem {
  idCpl?: string;
  cplId?: string;
  bobotCpl?: number;
  bobot?: number;
}

export interface ObeSubCpmkItem {
  id?: string;
  kode: string;
  deskripsi: string;
  cplPemetaan: ObeCplPemetaanItem[];
}

export interface ObeCpmkItem {
  id?: string;
  kode: string;
  deskripsi: string;
  target: number;
  bobot?: number;
  cplPemetaan: ObeCplPemetaanItem[];
  subCpmk: ObeSubCpmkItem[];
}

export interface ObePemetaanCpmkData {
  cplHeaders: ObeCplHeader[];
  cpmkData: ObeCpmkItem[];
  levelPemetaan: "CPMK" | "Sub-CPMK";
  metodePembobotan: "Manual" | "Otomatis";
}

export function getPemetaanCpmk(mataKuliahId: string) {
  return useQuery({
    queryKey: ["pemetaanCpmk", mataKuliahId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/obe/mata-kuliah/${mataKuliahId}/pemetaan-cpmk`);
      const data = response.data.data || {};
      return {
        cplHeaders: (data.cplHeaders || []) as ObeCplHeader[],
        cpmkData: (data.cpmkData || []) as ObeCpmkItem[],
        levelPemetaan: (data.mataKuliah?.levelPemetaan || "CPMK") as "CPMK" | "Sub-CPMK",
        metodePembobotan: (data.mataKuliah?.metodePembobotan || "Manual") as "Manual" | "Otomatis",
      } as ObePemetaanCpmkData;
    },
    enabled: !!mataKuliahId,
  });
}

export interface SaveCpmkListItem {
  kode: string;
  deskripsi: string;
  target: number;
  bobot: number;
  cplPemetaan?: { idCpl: string; bobotCpl: number }[];
  subCpmk?: { kode: string; deskripsi: string; cplPemetaan: { idCpl: string; bobotCpl: number }[] }[];
}

export function useSavePemetaanCpmk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mataKuliahId,
      levelPemetaan,
      metodePembobotan,
      cpmkList,
    }: {
      mataKuliahId: string;
      levelPemetaan: "CPMK" | "Sub-CPMK";
      metodePembobotan: "Manual" | "Otomatis";
      cpmkList: SaveCpmkListItem[];
    }) => {
      const response = await Api.post(`/akademik/obe/mata-kuliah/${mataKuliahId}/pemetaan-cpmk`, {
        levelPemetaan,
        metodePembobotan,
        cpmkList,
      });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pemetaanCpmk", variables.mataKuliahId] });
      queryClient.invalidateQueries({ queryKey: ["cpmkMapping", variables.mataKuliahId] });
    },
  });
}
