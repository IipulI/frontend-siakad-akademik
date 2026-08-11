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
}

const REQUIRED_FILTERS: Record<MonitoringJenis, (keyof MonitoringFilters)[]> = {
  "cpl-prodi": ["tahunKurikulumId", "prodiId"],
  "cpl-mahasiswa": ["tahunKurikulumId", "prodiId"],
  "cpl-mata-kuliah": ["tahunKurikulumId", "prodiId"],
  "mk-mahasiswa": ["tahunKurikulumId", "prodiId", "cpl"],
  "transkrip-obe": ["tahunKurikulumId", "prodiId", "mahasiswaId"],
  "cpmk-mahasiswa": ["tahunKurikulumId", "prodiId", "mataKuliahId"],
};

export function getMonitoring(jenis: MonitoringJenis, filters: MonitoringFilters) {
  const required = REQUIRED_FILTERS[jenis];
  const ready = required.every((key) => !!filters[key]);

  return useQuery({
    queryKey: ["obeMonitoring", jenis, filters],
    queryFn: async () => {
      const params: Record<string, string> = { kop: "true" };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const response = await Api.get(`/akademik/obe/monitoring/${jenis}`, { params });
      const data = response.data.data;
      return Array.isArray(data) ? data : data?.rows || data?.data || [];
    },
    enabled: ready,
  });
}

const pdfPathFor = (jenis: MonitoringJenis) => (jenis === "transkrip-obe" ? "transkrip-obe" : `monitoring-${jenis}`);

export async function exportMonitoringPdf(jenis: MonitoringJenis, filters: MonitoringFilters) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const params = new URLSearchParams({ kop: "true" });
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const response = await fetch(`${baseUrl}/akademik/obe/export/pdf/${pdfPathFor(jenis)}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengunduh PDF (status ${response.status})`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
