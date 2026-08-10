import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";
import { ObeFilters } from "../../types/obe.types";

// --- EXISTING HOOKS ---
export function getObe(filters: { page: number; limit: number; tahunKurikulumId?: string; prodiId?: string }) {
  return useQuery({
    queryKey: ["obeList", filters],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.get("/akademik/obe/manajemen-capaian", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: filters.page,
          limit: filters.limit,
          tahunKurikulumId: filters.tahunKurikulumId || undefined,
          prodiId: filters.prodiId || undefined,
        },
      });

      const rawData = response.data?.data ||  [];
      const count = response.data?.pagination?.totalItem || 0;

      const formattedData = rawData.map((item: any) => ({
        id: item.idObe,
        kodeProdi: item.kurikulum || "-", // Tampilkan tahun kurikulum sebagai penanda
        programStudi: item.programStudi || "-",
        pl: item.statusPengisian?.pl > 0,
        cpl: item.statusPengisian?.cpl > 0,
        plToCpl: item.statusPengisian?.persentasePlCpl > 0,
        cpmk: item.statusPengisian?.persentaseCplMk > 0,
        ketuaProgramStudi: item.ketuaProgramStudi || "-",
      }));

      console.log("hooks :", response?.data);

      return {
        data: formattedData,
        count,
      };
    },
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

// --- NEW HOOK (Untuk Fetch Data Tabel Mata Kuliah OBE) ---
export function getObeMataKuliah(filters: ObeFilters) {
  return useQuery({
    queryKey: ["obeMataKuliah", filters],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      // Endpoint sesuai dengan dokumentasi Postman: /api/akademik/obe/mata-kuliah
      const response = await Api.get("/akademik/obe/mata-kuliah", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        params: filters // Axios otomatis mengubah objek ini jadi query string (Combo Maut filter)
      });
      
      // Sesuaikan response.data.data tergantung struktur balikan JSON dari Backend
      return response.data; 
    },
  });
}