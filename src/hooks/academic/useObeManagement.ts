import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ObeData {
  id: string;
  kodeProgramStudi: string;
  programStudi: string;
  jenjang: {
    id: string;
    nama: string;
    jenjang: string;
  };
  statusPl: boolean;
  statusCpl: boolean;
  statusPlCpl: boolean;
  statusCpmk: boolean;
}

interface ObeFilters {
  tahunKurikulum: string;
  programStudi: string;
  jenjang: string;
}

export function getObe(filters: ObeFilters) {
  return useQuery({
    queryKey: ["obe", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.tahunKurikulum && filters.tahunKurikulum !== "all") {
        params.append("tahunKurikulum", filters.tahunKurikulum);
      }
      if (filters.programStudi && filters.programStudi !== "all") {
        params.append("programStudi", filters.programStudi);
      }
      if (filters.jenjang && filters.jenjang !== "all") {
        params.append("jenjang", filters.jenjang);
      }

      const endpoint = `/akademik/manajemen-obe?${params.toString()}`;

      const response = await Api.get(endpoint);

      return response.data.data;
    },

    placeholderData: keepPreviousData,
  });
}

export function getObeById(id: string) {
  return useQuery({
    queryKey: ["obeById", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.get(`/akademik/manajemen-obe/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    },
    enabled: !!id,
  });
}
