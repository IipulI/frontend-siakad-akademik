import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../api/Index";

export interface HeaderKolomNilai {
  id: string;
  label: string;
  bobot: number;
  labelKolom: string;
}

export interface BarisNilaiMahasiswa {
  no: number;
  rincianKrsId: string;
  mahasiswaId: string;
  nim: string;
  nama: string;
  angkatan: string;
  hadir: number | null;
  nilaiPerKomponen: Record<string, number | null>;
  nilaiAkhir: number;
  grade: string;
  angkaMutu: number;
  lulus: boolean;
  keterangan: string;
}

export interface NilaiKelasResult {
  skalaDipakai: "default" | "database";
  headerKolom: HeaderKolomNilai[];
  tabel: BarisNilaiMahasiswa[];
}

export function useNilaiKelas(kelasId: string) {
  return useQuery({
    queryKey: ["nilaiKelas", kelasId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/dosen/kelas/${kelasId}/nilai`);
      return response.data.data as NilaiKelasResult;
    },
    enabled: !!kelasId,
  });
}

export function useKunciNilaiKelas(kelasId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (action: "kunci" | "buka") => {
      const response = await Api.patch(`/akademik/dosen/kelas/${kelasId}/nilai/kunci`, { action });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nilaiKelas", kelasId] });
    },
  });
}

export function useKunciNilaiMahasiswa(kelasId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ rincianKrsId, action }: { rincianKrsId: string; action: "kunci" | "buka" }) => {
      const response = await Api.patch(`/akademik/dosen/kelas/${kelasId}/nilai/${rincianKrsId}/kunci`, { action });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nilaiKelas", kelasId] });
    },
  });
}

interface LaporanBase {
  kelas: { id: string; nama: string; sistemKuliah?: string };
  mataKuliah: { kode: string; nama: string; sks: number };
  programStudi: { nama: string; jenjang: string };
  periode: { nama: string; tahun: string | null; semester: string | null };
  dosen: { id: string; nama: string; nidn: string }[];
  komponenEvaluasi: HeaderKolomNilai[];
  totalMahasiswa: number;
}

export interface LaporanPerkuliahanResult extends LaporanBase {
  mahasiswa: {
    no: number;
    rincianKrsId: string;
    nim: string;
    nama: string;
    nilaiPerKomponen: Record<string, number | null>;
    nilaiAkhir: number;
    grade: string;
    angkaMutu: number;
    lulus: boolean;
    keterangan: string | null;
  }[];
  rataRataKelas: { rataPerKomponen: Record<string, number>; rataNilaiAkhir: number } | null;
}

export function useLaporanPerkuliahan(kelasId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["laporanPerkuliahan", kelasId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/dosen/kelas/${kelasId}/laporan/perkuliahan`);
      return response.data.data as LaporanPerkuliahanResult;
    },
    enabled: enabled && !!kelasId,
  });
}

export interface LaporanDaftarNilaiResult extends LaporanBase {
  mahasiswa: {
    no: number;
    rincianKrsId: string;
    nim: string;
    nama: string;
    nilaiPerKomponen: Record<string, number | null>;
    nilaiAkhir: number;
    nilaiAngka: number;
    nilaiHuruf: string;
    keterangan: string;
  }[];
}

export function useLaporanDaftarNilai(kelasId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["laporanDaftarNilai", kelasId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/dosen/kelas/${kelasId}/laporan/daftar-nilai`);
      return response.data.data as LaporanDaftarNilaiResult;
    },
    enabled: enabled && !!kelasId,
  });
}

// ---------- Komposisi Nilai (Rencana Evaluasi, dengan hirarki CPMK + Sub-CPMK) ----------

export interface MasterCpmkItem {
  id: string;
  kode: string;
  deskripsi?: string;
  parent_id?: string | null;
  subCpmk: { id: string; kode: string; deskripsi?: string; parent_id?: string | null }[];
}

export interface RencanaEvaluasiItem {
  id: string;
  siakPeriodeAkademikId: string;
  metodeEvaluasi: string;
  jenisEvaluasi: string;
  bobotEvaluasi: number;
  syaratLulus: string;
  deskripsi?: string;
  deskripsiInggris?: string;
  mappingBobotCpmk: Record<string, number>;
}

export interface KomposisiNilaiResult {
  mataKuliah: { id: string; kode: string; nama: string; totalSks: number };
  masterCpmk: MasterCpmkItem[];
  rencanaEvaluasi: RencanaEvaluasiItem[];
  periodeTerpilihId: string;
}

export function useKomposisiNilai(mataKuliahId: string, periodeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["komposisiNilaiKelas", mataKuliahId, periodeId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/dosen/mata-kuliah/${mataKuliahId}/rencana-evaluasi`, {
        params: { periodeId },
      });
      return response.data.data as KomposisiNilaiResult;
    },
    enabled: enabled && !!mataKuliahId && !!periodeId,
  });
}

// PDF tabel Nilai Perkuliahan langsung dari backend (beda dari halaman Laporan
// custom -- ini render server-side, cocok buat diunduh/diarsipkan).
export async function fetchNilaiKelasPdfBlobUrl(kelasId: string) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/akademik/dosen/kelas/${kelasId}/nilai/export?format=pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Gagal mengambil PDF (status ${response.status})`);
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

// ---------- Finalisasi Nilai (kunci permanen -> Lulus/Tidak Lulus) ----------
// Aksinya level Kaprodi (setara Admin Akademik di SEVIMA), tapi tombolnya
// ditaruh di tab Nilai Perkuliahan dulu supaya siap dipakai begitu pemisahan
// role Kaprodi di FE sudah ada -- endpoint & validasinya sudah di sisi Kaprodi.

export interface CpmkGagalItem {
  kode: string;
  nilai: number;
  target: number;
}

export interface FinalisasiNilaiResult {
  kelasId: string;
  jumlahLulus: number;
  jumlahTidakLulus: number;
  jumlahSudahFinalSebelumnya: number;
  daftarPerluMengulangCpmk: { rincianKrsId: string; mahasiswaId: string; cpmkGagal: CpmkGagalItem[] }[];
  pesan: string;
}

export function useFinalisasiNilaiKelas(kelasId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await Api.patch(`/akademik/kaprodi/kelas/${kelasId}/nilai/finalisasi`);
      return response.data.data as FinalisasiNilaiResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nilaiKelas", kelasId] });
    },
  });
}

// ---------- Input Nilai manual per mahasiswa (Jalur A) ----------
// Body: { nilai: [{ komposisiId, skor }] } -- komposisiId = id header kolom
// (HeaderKolomNilai.id), skor 0-100 per komponen evaluasi.
export function useSimpanNilaiMahasiswa(kelasId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ rincianKrsId, nilai }: { rincianKrsId: string; nilai: { komposisiId: string; skor: number }[] }) => {
      const response = await Api.post(`/akademik/dosen/kelas/${kelasId}/nilai/${rincianKrsId}`, { nilai });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nilaiKelas", kelasId] });
    },
  });
}
