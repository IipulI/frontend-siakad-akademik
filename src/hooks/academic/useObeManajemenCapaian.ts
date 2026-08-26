import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ManajemenCapaianItem {
  idObe: string | null;
  kurikulum: string;
  kodeProdi: string;
  programStudi: string;
  ketuaProgramStudi: string;
  statusPengisian: {
    pl: number;
    cpl: number;
    persentasePlCpl: number | null;
    persentaseCplMk: number;
  };
}

export interface ManajemenCapaianResult {
  items: ManajemenCapaianItem[];
  total: number;
  perPage: number;
  currentPage: number;
  totalPage: number;
}

export interface ManajemenCapaianFilters {
  tahunKurikulumId?: string;
  prodiId?: string;
  jenjangId?: string;
  page?: number;
  limit?: number;
}

export function useManajemenCapaian(filters: ManajemenCapaianFilters) {
  return useQuery({
    queryKey: ["obeManajemenCapaian", filters],
    queryFn: async () => {
      const params: Record<string, any> = { page: filters.page || 1, limit: filters.limit || 10 };
      if (filters.tahunKurikulumId && filters.tahunKurikulumId !== "all") params.tahunKurikulumId = filters.tahunKurikulumId;
      if (filters.prodiId && filters.prodiId !== "all") params.prodiId = filters.prodiId;
      if (filters.jenjangId && filters.jenjangId !== "all") params.jenjangId = filters.jenjangId;

      const response = await Api.get("/akademik/obe/manajemen-capaian", { params });
      // ResponseBuilder membongkar payload paginated {total, items} jadi `data` (array polos)
      // + `pagination` (objek terpisah) -- pola yang sama kayak endpoint list lain.
      const items = (response.data.data || []) as ManajemenCapaianItem[];
      const pagination = response.data.pagination || {};
      return {
        items,
        total: pagination.totalItems ?? items.length,
        perPage: pagination.perPage ?? filters.limit ?? 10,
        currentPage: pagination.currentPage ?? filters.page ?? 1,
        totalPage: pagination.totalPage ?? 1,
      } as ManajemenCapaianResult;
    },
  });
}

export async function exportLaporanLengkapPdf(idObeList: string[]) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const params = new URLSearchParams({ ids: idObeList.join(",") });

  const response = await fetch(`${baseUrl}/akademik/obe/export/pdf/laporan-lengkap?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengunduh laporan (status ${response.status})`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
