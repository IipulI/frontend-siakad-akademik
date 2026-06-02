import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

// --- EXISTING INTERFACES ---
// Tambahkan/Ubah di src/hooks/academic/useObeManagement.ts

export interface MataKuliahOBE {
  id: string; // atau uuid dari backend
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;
  kode: string;
  nama: string;
  namaEn: string | null;
  jenis: string;
  
  // Field SKS sesuai JSON Postman
  sksTatapMuka: number;
  sksPraktikum: number;
  sksPraktikLapangan: number;
  sksSimulasi: number;
  
  // Untuk data relasi yang di-join oleh backend (biasanya muncul di GET)
  prodi?: { nama: string }; 
  tahunKurikulum?: { tahun: string };
  
  // Asumsi field status balikan dari backend (atau jika belum ada dari BE, di-handle null dulu)
  statusRps?: 'Belum Terisi' | 'Sudah Terisi';
  statusCpl?: 'Belum Terisi' | 'Sudah Terisi';
  statusCpmk?: 'Belum Terisi' | 'Sudah Terisi';
}

// Filter sudah aman, sesuai dengan parameter Combo Maut di JSON
export interface ObeFilters {
  page: number;
  limit: number;
  prodiId?: string;
  tahunKurikulumId?: string;
  jenis?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}


// --- EXISTING HOOKS ---
export function getObe() {
  return useQuery({
    queryKey: ["obe"],
    queryFn: async () => {
      const response = await Api.get("/akademik/manajemen-obe");
      console.log("🔍 Raw OBE API data:", response.data.data);
      return response.data.data;
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