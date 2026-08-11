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

      // ResponseBuilder wraps paginated data as:
      // { status, message, data: <items[]>, pagination: {...}, errors: {} }
      // So items are directly at response.data.data (array)
      const rawData: any[] = Array.isArray(response.data?.data)
        ? response.data.data
        : response.data?.data?.rows || response.data?.rows || [];
      const count = response.data?.pagination?.totalItems
        || response.data?.data?.count
        || response.data?.count
        || rawData.length;

      const formattedData = rawData.map((item: any) => ({
        id: item.idObe,                           // OBE UUID (null jika belum ada OBE)
        kodeProdi: item.kodeProdi || null,         // kode prodi e.g. "55201"
        tahunKurikulum: item.kurikulum || "-",     // tahun kurikulum e.g. "2025"
        programStudi: item.programStudi || "-",    // "S1 - Teknik Informatika"
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