// src/types/models.ts

// --- Common Interfaces ---
export interface IApiResponseSuccess {
    status: string;
    message: string;
    // data?: any; // Opsional: jika response sukses juga mengembalikan data
}

export interface IPaginatedResponse<T> {
    status: string;
    message: string;
    data: T[];
    pagination: {
        currentPage: number;
        perPage: number;
        totalPages: number;
        totalItems: number;
    };
}

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
    inputType?: 'text' | 'number' | 'email' | 'date' | 'select'; // Tipe input HTML
    options?: IOption[];      // Opsi untuk select input
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
    tahun: string; // Nama Tahun Ajaran (e.g., "2016/2017")
    namaPeriode: string;
    kodePeriode: string;
    status: 'aktif' | 'inaktif' | 'ACTIVE' | 'INACTIVE';
    tanggalMulai: string; // Format "YYYY-MM-DD"
    tanggalSelesai: string; // Format "YYYY-MM-DD"
}

export interface IPeriodPayload {
    siakTahunAjaranId: string;
    namaPeriode: string;
    kodePeriode: string;
    tanggalMulai: string;
    tanggalSelesai: string;
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
    namaProgramStudi: string; // Contoh: "Teknik Informatika"
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

// --- Mata Kuliah ---
export interface IMataKuliah {
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

// --- Generic Payload Type for TableSetting's forms ---
export type TableFormPayload =
    IAcademicYearPayload |
    IPeriodPayload |
    ILevelPayload |
    ILimitSKSPayload |
    IGradingScalePayload |
    IGradeCompositionPayload;

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
