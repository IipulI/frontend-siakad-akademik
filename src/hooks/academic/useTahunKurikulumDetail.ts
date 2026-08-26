import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface DetailKurikulumHeader {
  tahun: string;
  keterangan: string;
  mulaiBerlaku: string;
  tanggalAwal: string;
  tanggalAkhir: string;
}

export interface DetailKurikulumProdiItem {
  programStudiId: string;
  kodeProdi: string;
  namaProgramStudi: string;
  isObe: boolean;
  jenisKurikulum: "OBE" | "Non OBE";
  targetCpl: number;
  targetCpmk: number;
}

export interface DetailKurikulumResult {
  header: DetailKurikulumHeader;
  listProdi: DetailKurikulumProdiItem[];
}

export function useDetailKurikulum(
  tahunKurikulumId: string,
  jenjangId: string,
  filters: { search?: string; jenisKurikulum?: string },
  enabled: boolean
) {
  return useQuery({
    queryKey: ["detailKurikulum", tahunKurikulumId, jenjangId, filters],
    queryFn: async () => {
      const params: Record<string, any> = { tahunKurikulumId, jenjangId };
      if (filters.search) params.search = filters.search;
      if (filters.jenisKurikulum && filters.jenisKurikulum !== "all") params.jenisKurikulum = filters.jenisKurikulum;

      const response = await Api.get("/akademik/kurikulum-prodi/list", { params });
      return response.data.data as DetailKurikulumResult;
    },
    enabled,
  });
}

export interface ProdiSetting {
  programStudiId: string;
  isObe: boolean;
  targetCpl: number;
  targetCpmk: number;
}

export function useSaveAturanObeBulk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tahunKurikulumId, prodiSettings }: { tahunKurikulumId: string; prodiSettings: ProdiSetting[] }) => {
      const response = await Api.post("/akademik/kurikulum-prodi/set-obe", { tahunKurikulumId, prodiSettings });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["detailKurikulum", variables.tahunKurikulumId] });
      queryClient.invalidateQueries({ queryKey: ["rekapTahunKurikulum"] });
    },
  });
}
