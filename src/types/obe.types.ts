// src/types/obe.types.ts

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

export interface ObeFilters {
  page: number;
  limit: number;
  prodiId?: string;
  tahunKurikulumId?: string;
  jenis?: string;
  search?: string;
  searchBy?: "kode" | "nama";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
