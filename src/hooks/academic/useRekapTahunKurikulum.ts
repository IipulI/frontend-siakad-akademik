import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface RekapTahunKurikulumItem {
  id: string;
  tahun: string;
  mulaiBerlaku: string;
  tanggalAwal: string;
  tanggalAkhir: string;
  keterangan: string;
  prodiObe: number;
  prodiNonObe: number;
}

export interface RekapTahunKurikulumResult {
  items: RekapTahunKurikulumItem[];
  total: number;
  perPage: number;
  currentPage: number;
  totalPage: number;
}

export function useRekapTahunKurikulum(filters: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["rekapTahunKurikulum", filters],
    queryFn: async () => {
      const response = await Api.get("/akademik/kurikulum-prodi/rekap-tahun", {
        params: { page: filters.page || 1, limit: filters.limit || 10 },
      });
      // ResponseBuilder membongkar payload paginated {total, items} jadi `data` (array polos)
      // + `pagination` (objek terpisah) -- pola yang sama kayak endpoint list lain.
      const items = (response.data.data || []) as RekapTahunKurikulumItem[];
      const pagination = response.data.pagination || {};
      return {
        items,
        total: pagination.totalItems ?? items.length,
        perPage: pagination.perPage ?? filters.limit ?? 10,
        currentPage: pagination.currentPage ?? filters.page ?? 1,
        totalPage: pagination.totalPage ?? 1,
      } as RekapTahunKurikulumResult;
    },
  });
}
