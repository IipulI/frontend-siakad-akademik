import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface RekapSksItem {
  tahunKurikulumId: string;
  tahun: string;
  prodiId: string;
  kodeProdi: string;
  programStudi: string;
  sksWajib: number;
  sksPilihan: number;
  totalSks: number;
}

export interface RekapSksResult {
  items: RekapSksItem[];
  total: number;
  perPage: number;
  currentPage: number;
  totalPage: number;
}

export interface RekapSksFilters {
  jenjangId?: string;
  prodiId?: string;
  tahunKurikulumId?: string;
  page?: number;
  limit?: number;
}

export function useRekapSks(filters: RekapSksFilters) {
  return useQuery({
    queryKey: ["kurikulumProdiRekapSks", filters],
    queryFn: async () => {
      const params: Record<string, any> = { page: filters.page || 1, limit: filters.limit || 10 };
      if (filters.jenjangId && filters.jenjangId !== "all") params.jenjangId = filters.jenjangId;
      if (filters.prodiId && filters.prodiId !== "all") params.prodiId = filters.prodiId;
      if (filters.tahunKurikulumId && filters.tahunKurikulumId !== "all") params.tahunKurikulumId = filters.tahunKurikulumId;

      const response = await Api.get("/akademik/mata-kuliah-kurikulum/rekap-sks", { params });
      // ResponseBuilder membongkar payload paginated {total, items} jadi `data` (array polos)
      // + `pagination` (objek terpisah) -- sama seperti pola di useObeTemplateEvaluasi.ts.
      const items = (response.data.data || []) as RekapSksItem[];
      const pagination = response.data.pagination || {};
      return {
        items,
        total: pagination.totalItems ?? items.length,
        perPage: pagination.perPage ?? filters.limit ?? 10,
        currentPage: pagination.currentPage ?? filters.page ?? 1,
        totalPage: pagination.totalPage ?? 1,
      } as RekapSksResult;
    },
  });
}

// ---------- Mata Kuliah per Semester (tab "Mata Kuliah Kurikulum") ----------

export interface MataKuliahKurikulumItem {
  id: string;
  kode: string;
  nama: string;
  totalSks: number;
  opsiWajib: boolean;
  statusMk: "Wajib" | "Pilihan";
  nilaiMin: string;
  semester: number | string;
  adaPraktikum: boolean;
  prasyarat: string;
  konsentrasi: string;
}

export interface SemesterGroup {
  semester: number | string;
  totalSksSemester: number;
  mataKuliah: MataKuliahKurikulumItem[];
}

export interface MataKuliahPerSemesterResult {
  header: { kodeProdi: string; programStudi: string; tahunKurikulum: string };
  semesterData: SemesterGroup[];
}

export function useMataKuliahPerSemester(prodiId: string, tahunKurikulumId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["mataKuliahPerSemester", prodiId, tahunKurikulumId],
    queryFn: async () => {
      const response = await Api.get("/akademik/mata-kuliah-kurikulum/per-semester", { params: { prodiId, tahunKurikulumId } });
      return response.data.data as MataKuliahPerSemesterResult;
    },
    enabled,
  });
}

export function useAssignMataKuliahKurikulum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { mataKuliahId: string; semester: number; nilaiMin: string; statusMk: string; mkPaket: boolean }) => {
      const response = await Api.post("/akademik/mata-kuliah-kurikulum/assign", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mataKuliahPerSemester"] });
      queryClient.invalidateQueries({ queryKey: ["kurikulumProdiRekapSks"] });
    },
  });
}

export function useDeleteMataKuliahKurikulum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await Api.delete(`/akademik/mata-kuliah-kurikulum/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mataKuliahPerSemester"] });
      queryClient.invalidateQueries({ queryKey: ["kurikulumProdiRekapSks"] });
    },
  });
}

export async function fetchPratinjauSalinMataKuliahKurikulum(prodiId: string, tahunKurikulumIdAsal: string) {
  const response = await Api.get("/akademik/mata-kuliah-kurikulum/pratinjau-salin", { params: { prodiId, tahunKurikulumIdAsal } });
  return response.data.data;
}

export function useSalinMataKuliahKurikulum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { prodiId: string; tahunKurikulumIdAsal: string; tahunKurikulumIdTujuan: string }) => {
      const response = await Api.post("/akademik/mata-kuliah-kurikulum/salin", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mataKuliahPerSemester"] });
      queryClient.invalidateQueries({ queryKey: ["kurikulumProdiRekapSks"] });
    },
  });
}

// ---------- Skala Nilai ----------

export interface SkalaNilaiRow {
  id?: string;
  grade: string;
  bobot: number;
  nilaiBawah: number;
  nilaiAtas: number;
  keterangan: string;
  nilaiDefault: boolean;
}

export interface SkalaNilaiResult {
  header: { kurikulum: string; keterangan: string; jenjang: string; mulaiBerlaku: string; tanggalAwal: string; tanggalAkhir: string };
  daftarPeriode: Array<{ id: string; nama: string; status: string }>;
  skalaNilai: SkalaNilaiRow[];
  usingFallbackAwal: boolean;
}

export function useSkalaNilai(jenjangId: string, tahunKurikulumId: string, periodeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["skalaNilai", jenjangId, tahunKurikulumId, periodeId],
    queryFn: async () => {
      const params: Record<string, any> = { jenjangId, tahunKurikulumId };
      if (periodeId) params.periodeId = periodeId;
      const response = await Api.get("/akademik/skala-nilai", { params });
      return response.data.data as SkalaNilaiResult;
    },
    enabled,
  });
}

export function useSaveSkalaNilai() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { tahunKurikulumId: string; jenjangId: string; periodeId: string; dataSkala: SkalaNilaiRow[] }) => {
      const response = await Api.post("/akademik/skala-nilai", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skalaNilai"] });
    },
  });
}

export async function fetchPratinjauSalinSkalaNilai(jenjangIdAsal: string, tahunKurikulumIdAsal: string, periodeIdAsal: string) {
  const response = await Api.get("/akademik/skala-nilai/pratinjau-salin", { params: { jenjangIdAsal, tahunKurikulumIdAsal, periodeIdAsal } });
  return response.data.data;
}

export function useSalinSkalaNilai() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      jenjangIdAsal: string;
      tahunKurikulumIdAsal: string;
      periodeIdAsal: string;
      jenjangIdTujuan: string;
      tahunKurikulumIdTujuan: string;
      periodeIdTujuan: string;
    }) => {
      const response = await Api.post("/akademik/skala-nilai/salin", payload);
      return response.data.data as { jumlahDisalin: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skalaNilai"] });
    },
  });
}

// ---------- Ekivalensi Mata Kuliah ----------

export interface EkivalensiRow {
  mkBaruId: string;
  mkBaruKode: string;
  mkBaruNama: string;
  mkBaruSks: number;
  mkLamaId: string | null;
}

export interface EkivalensiResult {
  header: { kodeProdi: string; namaProdi: string; tahunKurikulumBaru: string; pilihanKurikulumLama: Array<{ id: string; tahun: string }> };
  tabel: EkivalensiRow[];
}

export function useEkivalensiMataKuliah(prodiId: string, kurikulumBaruId: string, kurikulumLamaId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["ekivalensiMataKuliah", prodiId, kurikulumBaruId, kurikulumLamaId],
    queryFn: async () => {
      const response = await Api.get("/akademik/ekivalensi-mata-kuliah", { params: { prodiId, kurikulumBaruId, kurikulumLamaId } });
      return response.data.data as EkivalensiResult;
    },
    enabled,
  });
}

export function useDropdownMkLama(prodiId: string, kurikulumLamaId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["dropdownMkLama", prodiId, kurikulumLamaId],
    queryFn: async () => {
      const response = await Api.get("/akademik/ekivalensi-mata-kuliah/dropdown-lama", { params: { prodiId, kurikulumLamaId } });
      return response.data.data as Array<{ id: string; label: string }>;
    },
    enabled,
  });
}

export function useSaveBulkEkivalensi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dataEkivalensi: Array<{ mkBaruId: string; mkLamaId: string | null }>) => {
      const response = await Api.post("/akademik/ekivalensi-mata-kuliah/bulk", { dataEkivalensi });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ekivalensiMataKuliah"] });
    },
  });
}

// ---------- Predikat Kelulusan ----------

export interface PredikatRow {
  id: string;
  kode: string;
  nama: string;
  namaEn: string;
  ipkMin: number;
  ipkMax: number;
  masaStudi: number;
}

export interface PredikatResult {
  header: { kurikulum: string; mulaiBerlaku: string; tanggalAwal: string; tanggalAkhir: string; programStudi?: string };
  tabel: PredikatRow[];
}

export function usePredikatKelulusan(
  tahunKurikulumId: string,
  filters: { prodiId?: string; jenjangId?: string },
  enabled: boolean
) {
  return useQuery({
    queryKey: ["predikatKelulusan", tahunKurikulumId, filters],
    queryFn: async () => {
      const params: Record<string, any> = { tahunKurikulumId };
      if (filters.prodiId) params.prodiId = filters.prodiId;
      else if (filters.jenjangId) params.jenjangId = filters.jenjangId;
      const response = await Api.get("/akademik/predikat-kelulusan", { params });
      return response.data.data as PredikatResult;
    },
    enabled,
  });
}

export interface SavePredikatPayload {
  id?: string;
  siakTahunKurikulumId: string;
  siakJenjangId: string;
  kode: string;
  namaInd: string;
  // Backend nyimpen field ini sebagai `namaEng` di model, meski pas GET
  // dibalikin sebagai `namaEn` di response -- lihat services/predikat-kelulusan.service.js.
  namaEng: string;
  ipkMin: number;
  ipkMax: number;
  masaStudi: number;
}

export function useSavePredikat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SavePredikatPayload) => {
      const response = payload.id
        ? await Api.put(`/akademik/predikat-kelulusan/${payload.id}`, payload)
        : await Api.post("/akademik/predikat-kelulusan", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predikatKelulusan"] });
    },
  });
}

export function useDeletePredikat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await Api.delete(`/akademik/predikat-kelulusan/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predikatKelulusan"] });
    },
  });
}

export async function fetchPratinjauSalinPredikat(jenjangIdAsal: string, tahunKurikulumIdAsal: string) {
  const response = await Api.get("/akademik/predikat-kelulusan/pratinjau-salin", { params: { jenjangIdAsal, tahunKurikulumIdAsal } });
  return response.data.data;
}

export function useSalinPredikat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { jenjangIdAsal: string; tahunKurikulumIdAsal: string; jenjangIdTujuan: string; tahunKurikulumIdTujuan: string }) => {
      const response = await Api.post("/akademik/predikat-kelulusan/salin", payload);
      return response.data.data as { jumlahDisalin: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predikatKelulusan"] });
    },
  });
}

// ---------- Batas SKS ----------

export interface BatasSksRow {
  id: string;
  siakJenjangId: string;
  ipsMin: number;
  ipsMax: number;
  batasSks: number;
}

export interface BatasSksResult {
  header: { kurikulum: string; keterangan: string; mulaiBerlaku: string; tanggalAwal: string; tanggalAkhir: string };
  batasSks: BatasSksRow[];
}

export function useBatasSks(jenjangId: string, tahunKurikulumId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["batasSks", jenjangId, tahunKurikulumId],
    queryFn: async () => {
      const response = await Api.get("/akademik/batas-sks", { params: { jenjangId, tahunKurikulumId } });
      return response.data.data as BatasSksResult;
    },
    enabled,
  });
}

export interface SaveBatasSksPayload {
  id?: string;
  siakJenjangId: string;
  siakTahunKurikulumId: string;
  ipsMin: number;
  ipsMax: number;
  batasSks: number;
}

export function useSaveBatasSks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SaveBatasSksPayload) => {
      const response = payload.id
        ? await Api.put(`/akademik/batas-sks/${payload.id}`, payload)
        : await Api.post("/akademik/batas-sks", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batasSks"] });
    },
  });
}

export function useDeleteBatasSks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await Api.delete(`/akademik/batas-sks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batasSks"] });
    },
  });
}

export async function fetchPratinjauSalinBatasSks(jenjangIdAsal: string, tahunKurikulumIdAsal: string) {
  const response = await Api.get("/akademik/batas-sks/pratinjau-salin", { params: { jenjangIdAsal, tahunKurikulumIdAsal } });
  return response.data.data;
}

export function useSalinBatasSks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { jenjangIdAsal: string; tahunKurikulumIdAsal: string; jenjangIdTujuan: string; tahunKurikulumIdTujuan: string }) => {
      const response = await Api.post("/akademik/batas-sks/salin", payload);
      return response.data.data as { jumlahDisalin: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batasSks"] });
    },
  });
}

// ---------- Aturan Evaluasi ----------

export interface AturanEvaluasiRow {
  id: string;
  semesterKe: number;
  totalSksMinimal: number;
  batasIpkMinimal: number | string;
}

export interface AturanEvaluasiResult {
  header: { kurikulum: string; keterangan: string; mulaiBerlaku: string; tanggalAwal: string; tanggalAkhir: string };
  tabel: AturanEvaluasiRow[];
}

export function useAturanEvaluasi(tahunKurikulumId: string, jenjangId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["aturanEvaluasi", tahunKurikulumId, jenjangId],
    queryFn: async () => {
      const response = await Api.get("/akademik/aturan-evaluasi", { params: { tahunKurikulumId, jenjangId } });
      return response.data.data as AturanEvaluasiResult;
    },
    enabled,
  });
}

export interface SaveAturanEvaluasiPayload {
  id?: string;
  siakTahunKurikulumId: string;
  siakJenjangId: string;
  semesterKe: number;
  totalSksMinimal: number;
  batasIpkMinimal: number;
}

export function useSaveAturanEvaluasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SaveAturanEvaluasiPayload) => {
      const response = await Api.post("/akademik/aturan-evaluasi", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aturanEvaluasi"] });
    },
  });
}

export function useDeleteAturanEvaluasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await Api.delete(`/akademik/aturan-evaluasi/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aturanEvaluasi"] });
    },
  });
}

export async function fetchPratinjauSalinAturanEvaluasi(jenjangIdAsal: string, tahunKurikulumIdAsal: string) {
  const response = await Api.get("/akademik/aturan-evaluasi/pratinjau-salin", { params: { jenjangIdAsal, tahunKurikulumIdAsal } });
  return response.data.data;
}

export function useSalinAturanEvaluasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { jenjangIdAsal: string; tahunKurikulumIdAsal: string; jenjangIdTujuan: string; tahunKurikulumIdTujuan: string }) => {
      const response = await Api.post("/akademik/aturan-evaluasi/salin", payload);
      return response.data.data as { jumlahDisalin: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aturanEvaluasi"] });
    },
  });
}
