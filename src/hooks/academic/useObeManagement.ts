import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

// --- Detail + Update Mata Kuliah OBE (endpoint: /akademik/obe/mata-kuliah/:id) ---
export interface ObeMataKuliahUpdatePayload {
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;
  kelompokMataKuliahId: string | null;
  rumpunMataKuliahId: string | null;
  kode: string;
  nama: string;
  namaEn: string;
  jenis: string;
  adaPraktikum: boolean;
  sksTatapMuka: number;
  sksPraktikum: number;
  sksPraktikLapangan: number;
  sksSimulasi: number;
  merupakanMku: boolean;
  adaSap: boolean;
  adaSilabus: boolean;
  adaBahanAjar: boolean;
  adaDiktat: boolean;
  koordinatorMkId: string | null;
  pengembangRpsIds: string[];
  prasyaratMataKuliah1Id: string | null;
  prasyaratMataKuliah2Id: string | null;
  prasyaratMataKuliah3Id: string | null;
}

// Payload CREATE sama seperti UPDATE tapi tanpa 3 field prasyarat (dikonfirmasi tim Backend).
export type ObeMataKuliahCreatePayload = Omit<
  ObeMataKuliahUpdatePayload,
  "prasyaratMataKuliah1Id" | "prasyaratMataKuliah2Id" | "prasyaratMataKuliah3Id"
>;

export interface KelompokMataKuliah {
  id: string;
  kode: string;
  nama: string;
}

// Endpoint dikonfirmasi Backend: tanpa param page/size, balikin semua tanpa pagination.
export function getKelompokMataKuliah() {
  return useQuery({
    queryKey: ["kelompokMataKuliah"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await Api.get("/akademik/kelompok-mata-kuliah", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const raw = response.data;
      const items: KelompokMataKuliah[] =
        raw?.data?.rows ??
        raw?.rows ??
        raw?.data?.data?.rows ??
        (Array.isArray(raw?.data) ? raw.data : undefined) ??
        (Array.isArray(raw) ? raw : undefined) ??
        [];
      return { items };
    },
  });
}

export function getObeMataKuliahDetail(id: string) {
  return useQuery({
    queryKey: ["obeMataKuliahDetail", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await Api.get(`/akademik/obe/mata-kuliah/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data?.data ?? response.data;
    },
    enabled: !!id,
  });
}

export function useCreateObeMataKuliah() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ObeMataKuliahCreatePayload) => {
      const token = localStorage.getItem("token");
      const response = await Api.post("/akademik/obe/mata-kuliah", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      // Backend langsung balikin detail lengkap mata kuliah yang baru dibuat (sama bentuk dengan GET).
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeMataKuliah"] });
    },
  });
}

export function useUpdateObeMataKuliah() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ObeMataKuliahUpdatePayload }) => {
      const token = localStorage.getItem("token");
      const response = await Api.put(`/akademik/obe/mata-kuliah/${id}`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data?.data ?? response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obeMataKuliahDetail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["obeMataKuliah"] });
    },
  });
}

export function useDeleteObeMataKuliah() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      const response = await Api.delete(`/akademik/obe/mata-kuliah/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeMataKuliah"] });
    },
  });
}