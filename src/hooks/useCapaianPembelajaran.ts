import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";

export interface CapaianHeader {
  programStudi: string;
  periode: string;
  mataKuliah: string;
  namaKelas: string;
  kurikulum: string;
  sistemKuliah: string;
  kapasitas: number;
  peserta: number;
}

export interface CpmkInfoItem {
  id: string;
  kode: string;
  deskripsi?: string;
  parentKode?: string | null;
  parentDeskripsi?: string | null;
  groupSize?: number;
  isGroupFirst?: boolean;
}

export interface CapaianCpmkRow {
  no: number;
  nim: string;
  nama: string;
  angkatan: string;
  nilaiCpmk: Record<string, number | null>;
  statusCapaian: "Sudah Memenuhi" | "Belum Memenuhi" | "Belum Dinilai";
}

export interface CapaianCpmkResult {
  header: CapaianHeader;
  cpmkInfo: CpmkInfoItem[];
  hasSubCpmk: boolean;
  targetCpmk: Record<string, number>;
  tabel: CapaianCpmkRow[];
  rerataPerolehan: Record<string, number | null>;
  pemetaanBerbeda?: boolean;
  pesan?: string;
}

export function useCapaianCpmk(kelasId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["capaianCpmk", kelasId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/dosen/kelas/${kelasId}/capaian/cpmk`);
      return response.data.data as CapaianCpmkResult;
    },
    enabled: enabled && !!kelasId,
  });
}

export interface CplInfoItem {
  id: string;
  kode: string;
  deskripsi?: string;
}

export interface CapaianCplRow {
  no: number;
  nim: string;
  nama: string;
  angkatan: string;
  nilaiCpl: Record<string, number | null>;
}

export interface CapaianCplResult {
  header: CapaianHeader;
  cplInfo: CplInfoItem[];
  targetCpl: Record<string, number>;
  tabel: CapaianCplRow[];
  rerataPerolehan: Record<string, number | null>;
  pesan?: string;
}

export function useCapaianCpl(kelasId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["capaianCpl", kelasId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/dosen/kelas/${kelasId}/capaian/cpl`);
      return response.data.data as CapaianCplResult;
    },
    enabled: enabled && !!kelasId,
  });
}

export async function fetchCapaianExportBlobUrl(kelasId: string, jenis: "cpmk" | "cpl") {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(
    `${baseUrl}/akademik/dosen/kelas/${kelasId}/capaian/export?format=pdf&jenis=${jenis}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!response.ok) {
    throw new Error(`Gagal mengambil PDF (status ${response.status})`);
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
