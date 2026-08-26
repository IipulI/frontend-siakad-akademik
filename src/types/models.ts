// src/types/models.ts

// --- Common Interfaces ---
// IApiResponseSuccess and IPaginatedResponse now live in common.types.ts (single source of truth).

/**
 * Interface standar untuk item-item dalam dropdown (select options).
 */
export interface IOption {
    value: string;
    label: string;
}

/**
 * Interface untuk mendefinisikan kolom tabel yang generik.
 * T adalah tipe data untuk setiap baris.
 */
export interface ITableColumn<T> {
    key: keyof T | 'actions'; // Kunci properti di objek data, atau 'actions' untuk kolom tombol
    header: string;           // Teks header kolom
    isEditable?: boolean;     // Apakah kolom ini bisa diedit dalam mode inline
    inputType?: 'text' | 'number' | 'email' | 'date' | 'time' | 'select'; // Tipe input HTML
    options?: IOption[];      // Opsi untuk select input
    isBoolean?: boolean;      // Apakah kolom ini merepresentasikan nilai boolean (ditampilkan sebagai checkbox)
}

// --- Academic Year (Tahun Ajaran) ---
export interface IAcademicYear {
    id: string;
    tahun: string; // Contoh: "2024"
    nama: string; // Contoh: "2024/2025"
}

export interface IAcademicYearPayload {
    tahun: string;
    nama: string;
}

// --- Period (Periode Akademik) ---
export interface IPeriod {
    id: string;
    tahun: string;
    nama: string;
    kode: string;
    status: 'aktif' | 'inaktif' | 'ACTIVE' | 'INACTIVE';
    tanggalMulai: string;
    tanggalSelesai: string;
}

export interface IPeriodPayload {
    siakTahunAjaranId: string;
    namaPeriode: string;
    kodePeriode: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    // Bukan field yang bisa diedit lewat UI (belum ada kontrolnya) -- cuma
    // dibawa apa adanya pas edit biar update backend gak nolak request-nya
    // (endpoint update mewajibkan status ada di body) dan nilainya gak
    // kebetulan ketiban jadi kosong.
    status?: string;
}

// --- Level (Jenjang Pendidikan) ---
export interface ILevel {
    id: string;
    nama: string;    // Contoh: "Sarjana"
    jenjang: string; // Contoh: "S1" (singkatan)
}

export interface ILevelPayload {
    nama: string;
    jenjang: string;
}

// --- Limit SKS (Batas SKS) ---
export interface ILimitSKS {
    id: string;
    jenjang: string; // Nama Jenjang (e.g., "Sarjana")
    ipsMin: number;
    ipsMax: number;
    batasSks: number;
}

export interface ILimitSKSPayload {
    siakJenjangId: string;
    ipsMin: number;
    ipsMax: number;
    batasSks: number;
}

// --- Program Studi ---
export interface IProgramStudi {
    id: string;
    kode: string;
    nama: string; // Contoh: "Teknik Informatika"
    jenjang: { // Nested object
        id: string;
        nama: string;
        jenjang: string; // Abbreviation like "S1"
    };
}

export interface IProgramStudiPayload {
    namaProgramStudi: string;
    jenjangId: string; // Assuming future payload
}

// --- Grading Scale (Skala Penilaian) ---
export interface IGradingScale {
    id: string;
    tahunAjaran: string;   // Nama Tahun Ajaran (e.g., "2015")
    programStudi: string;  // Nama Program Studi (e.g., "Teknik Informatika")
    hurufMutu: string;
    angkaMutu: number;
    nilaiMin: number;
    nilaiMax: number;
}

export interface IGradingScalePayload {
    siakTahunAjaranId: string;
    siakProgramStudiId: string;
    hurufMutu: string;
    angkaMutu: number;
    nilaiMin: number;
    nilaiMax: number;
}

// --- Grade Composition (Komposisi Nilai) ---
export interface IGradeComposition {
    id: string;
    nama: 'Kehadiran' | 'Tugas' | 'UTS' | 'UAS'; // Nama komponen yang fix
    persentase: number;
    siakTahunKurikulumId?: string; // Opsional di GET, tapi ada di payload
}

export interface IGradeCompositionPayload {
    siakTahunKurikulumId: string;
    nama: 'Kehadiran' | 'Tugas' | 'UTS' | 'UAS';
    persentase: number;
}

// --- Mata Kuliah (admin catalog entry — distinct from mahasiswa.types.ts's student-facing IMataKuliah) ---
export interface IMataKuliahAdmin {
    id: string;
    programStudi: string; // Name, not ID
    tahunKurikulum: string; // Year string, not ID
    semester: string;
    nilaiMin: string;
    sksTatapMuka: number;
    sksPraktikum: number;
    adaPraktikum: boolean;
    opsiMataKuliah: boolean;
    kodeMataKuliah: string;
    namaMataKuliah: string;
    jenisMataKuliah: string;
    prasyaratMataKuliah1: {
        id: string;
        kodeMataKuliah: string;
        namaMataKuliah: string;
    } | null;
    prasyaratMataKuliah2: any | null; // Placeholder
    prasyaratMataKuliah3: any | null; // Placeholder
}

// --- Payloads for Specific Single Assignments ---
export interface ISingleAssignmentPayload {
    siakMataKuliahId: string;
    siakKomposisiNilaiId: string; // ID dari komponen individual (Kehadiran, Tugas, dll.)
}

// --- Response for Composition Details per Mata Kuliah (GET /akademik/komposisi-nilai-mata-kuliah/{mataKuliahId}) ---
export interface IMataKuliahCompositionDetailsResponse {
    siakKomposisiNilaiId: string; // Ini ID dari komponen individual template
    nama: 'Kehadiran' | 'Tugas' | 'UTS' | 'UAS';
    persentase: number;
}

// --- Data Pelengkap: Perguruan Tinggi ---
export interface ISistemKuliah {
    id: string;
    nama: string;
    keterangan?: string | null;
}
export interface ISistemKuliahPayload {
    nama: string;
    keterangan?: string;
}

export interface IRuangan {
    id: string;
    siakFakultasId: string;
    nama: string;
    ruangan: string;
    kapasitas: number;
    lantai: number;
}
export interface IRuanganPayload {
    siakFakultasId: string;
    nama: string;
    ruangan: string;
    kapasitas: number;
    lantai: number;
}

// --- Data Pelengkap: Konsentrasi ---
export interface IKonsentrasi {
    id: string;
    siakProgramStudiId: string;
    kode: string;
    nama: string;
}
export interface IKonsentrasiPayload {
    siakProgramStudiId: string;
    kode: string;
    nama: string;
}

// --- Data Pelengkap: Perkuliahan ---
export interface IJenisMataKuliah {
    id: string;
    kode: string;
    nama: string;
}
export interface IJenisMataKuliahPayload {
    kode: string;
    nama: string;
}

export interface ISlotWaktu {
    id: string;
    waktu: string;
}
export interface ISlotWaktuPayload {
    waktu: string;
}

export interface IJenisPertemuan {
    id: string;
    nama: string;
}
export interface IJenisPertemuanPayload {
    nama: string;
}

// --- Data Pelengkap: Biodata ---
export interface IAgama {
    id: string;
    nama: string;
}
export interface IAgamaPayload {
    nama: string;
}

export interface ISuku {
    id: string;
    nama: string;
}
export interface ISukuPayload {
    nama: string;
}

export interface IPenghasilan {
    id: string;
    range: string;
}
export interface IPenghasilanPayload {
    range: string;
}

export interface IPekerjaan {
    id: string;
    nama: string;
}
export interface IPekerjaanPayload {
    nama: string;
}

export interface IJasAlmamater {
    id: string;
    nama: string;
}
export interface IJasAlmamaterPayload {
    nama: string;
}

// --- Data Pelengkap: Mahasiswa ---
export interface IStatusMahasiswa {
    id: string;
    kode: string;
    nama: string;
    aktif: boolean;
    kuliah: boolean;
}
export interface IStatusMahasiswaPayload {
    kode: string;
    nama: string;
    aktif: boolean;
    kuliah: boolean;
}

export interface IJenisTinggal {
    id: string;
    kode: string;
    nama: string;
}
export interface IJenisTinggalPayload {
    kode: string;
    nama: string;
}

export interface ITransportasi {
    id: string;
    kode: string;
    nama: string;
}
export interface ITransportasiPayload {
    kode: string;
    nama: string;
}

export interface IKebutuhanKhusus {
    id: string;
    nama: string;
}
export interface IKebutuhanKhususPayload {
    nama: string;
}

// --- Generic Payload Type for TableSetting's forms ---
export type TableFormPayload =
    IAcademicYearPayload |
    IPeriodPayload |
    ILevelPayload |
    ILimitSKSPayload |
    IGradingScalePayload |
    IGradeCompositionPayload |
    ISistemKuliahPayload |
    IRuanganPayload |
    IJenisMataKuliahPayload |
    ISlotWaktuPayload |
    IJenisPertemuanPayload |
    IAgamaPayload |
    ISukuPayload |
    IPenghasilanPayload |
    IPekerjaanPayload |
    IJasAlmamaterPayload |
    IStatusMahasiswaPayload |
    IJenisTinggalPayload |
    ITransportasiPayload |
    IKebutuhanKhususPayload |
    IKonsentrasiPayload;

// --- Bulk Assignment Payload (Initial Concept, not used in final SetComposition logic) ---
// Kept for context if backend implements a true bulk set assignment
export interface IBulkAssignmentPayload {
    siakTahunKurikulumId: string;
    siakProgramStudiId: string;
    komposisiNilaiDetails: IGradeCompositionPayload[];
    siakKomposisiNilaiId?: string; // Placeholder for single ID from previous interpretations
}

export interface IMataKuliahCompositionPayload {
    siakMataKuliahId: string; // ID Mata Kuliah yang akan di-assign
    siakKomposisiNilaiId: string; // ID dari komponen komposisi nilai individual (contoh: ID dari template "Kehadiran (15%)")
}
