// src/types/obe.types.ts

export interface MataKuliahOBE {
  id: string;
  kode: string;
  nama: string;
  sksTatapMuka: number;
  sksPraktikum: number;
  sksPraktikLapangan?: number;
  sksSimulasi?: number;
  jenis: string;
  prodi?: { nama: string };
  tahunKurikulum?: { tahun: string };
  // Menyesuaikan dengan status pengisian di mockup
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
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}