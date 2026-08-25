import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export type MonitoringJenis =
  | "cpl-prodi"
  | "cpl-mahasiswa"
  | "cpl-mata-kuliah"
  | "mk-mahasiswa"
  | "transkrip-obe"
  | "cpmk-mahasiswa";

export interface MonitoringFilters {
  tahunKurikulumId?: string;
  prodiId?: string;
  angkatan?: string;
  metode?: "rerata" | "progresif";
  cpl?: string;
  mataKuliahId?: string;
  mahasiswaId?: string;
  kop?: boolean;
}

export const REQUIRED_FILTERS: Record<MonitoringJenis, (keyof MonitoringFilters)[]> = {
  "cpl-prodi": ["tahunKurikulumId", "prodiId", "angkatan"],
  "cpl-mahasiswa": ["tahunKurikulumId", "prodiId", "angkatan"],
  "cpl-mata-kuliah": ["tahunKurikulumId", "prodiId", "angkatan"],
  "mk-mahasiswa": ["tahunKurikulumId", "prodiId", "angkatan", "cpl"],
  "transkrip-obe": ["tahunKurikulumId", "prodiId", "mahasiswaId"],
  "cpmk-mahasiswa": ["tahunKurikulumId", "prodiId", "mataKuliahId", "angkatan"],
};

// Tiap jenis laporan naruh baris datanya di field yang beda-beda di response
// (bukan `.rows`/`.data` yang seragam) -- lihat services/monitoring.service.js.
export const ROWS_FIELD_FOR: Record<MonitoringJenis, string> = {
  "cpl-prodi": "tabel",
  "cpl-mahasiswa": "dataMahasiswa",
  "cpl-mata-kuliah": "dataMataKuliah",
  "mk-mahasiswa": "dataMahasiswa",
  "transkrip-obe": "tabel",
  "cpmk-mahasiswa": "dataMahasiswa",
};

// Bentuk mentah balikan tiap endpoint monitoring (info + kombinasi chart/summary/
// tabel/daftarCpl/daftarCpmk/mkList/semesters tergantung jenis laporan).
export interface MonitoringRawResult {
  info: Record<string, any>;
  [key: string]: any;
}

export function getMonitoring(jenis: MonitoringJenis, filters: MonitoringFilters, enabled: boolean) {
  const required = REQUIRED_FILTERS[jenis];
  const ready = enabled && required.every((key) => !!filters[key]);

  return useQuery({
    queryKey: ["obeMonitoring", jenis, filters],
    queryFn: async () => {
      const params: Record<string, string> = { kop: filters.kop === false ? "false" : "true" };
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && key !== "kop") params[key] = String(value);
      });
      const response = await Api.get(`/akademik/obe/monitoring/${jenis}`, { params });
      return (response.data.data || { info: {} }) as MonitoringRawResult;
    },
    enabled: ready,
  });
}

const pdfPathFor = (jenis: MonitoringJenis) => (jenis === "transkrip-obe" ? "transkrip-obe" : `monitoring-${jenis}`);

// Backend export PDF ngirim JSON (bukan PDF) kalau gagal (mis. "Data OBE tidak
// ditemukan"), jadi kita coba baca pesannya dulu sebelum jatuh ke pesan generik.
async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.clone().json();
    if (body?.message) return body.message as string;
  } catch {
    // bukan JSON, biarkan jatuh ke pesan generik di bawah
  }
  return `Gagal memuat PDF (status ${response.status})`;
}

export async function fetchMonitoringPdfBlobUrl(jenis: MonitoringJenis, filters: MonitoringFilters) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const params = new URLSearchParams({ kop: filters.kop === false ? "false" : "true" });
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && key !== "kop") params.set(key, String(value));
  });

  const response = await fetch(`${baseUrl}/akademik/obe/export/pdf/${pdfPathFor(jenis)}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function exportMonitoringPdf(jenis: MonitoringJenis, filters: MonitoringFilters) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const params = new URLSearchParams({ kop: filters.kop === false ? "false" : "true" });
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && key !== "kop") params.set(key, String(value));
  });

  const response = await fetch(`${baseUrl}/akademik/obe/export/pdf/${pdfPathFor(jenis)}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
