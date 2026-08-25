// src/types/mahasiswa.types.ts
export interface IStudentBiodata {
    id: string | number;
    nim: string;
    nama: string;
    prodi: string;
    status: string;
    angkatan: string;
    kurikulum: string;
    semester: string;
    pembimbing: string;
    sksLulus: string;
    totalSks: string;
}

export interface IRetakePeriod {
    periodeAkademik: string;
    sks: number;
    semester: number;
    nilai: string;
}

export interface IApiRetakeCourse {
    namaMataKuliah: string;
    kodeMataKuliah: string;
    periode: IRetakePeriod[];
}

export interface IFlattenedRetakeCourse {
    id: string;
    no: number;
    kodeMk: string;
    namaMataKuliah: string;
    priode: string;
    sks: number;
    semester: string;
    nilai: string;
}

export interface IStudentGradeComponent {
    namaKomposisi: string;
    persentase: number;
    nilai: number;
}

export interface IStudentGradeCourse {
    tahunKurikulum: string;
    kodeMataKuliah: string;
    namaMataKuliah: string;
    namaKelas: string;
    komposisiNilaiMataKuliahResDto: IStudentGradeComponent[];
    nilai: number | null;
    nilaiAkhir: number | null;
}

export interface IKrsHistoryCourse {
    kodeMataKuliah: string;
    namaMataKuliah: string;
    kelas: string;
    sks: number;
    hari: string | null;
    jam: string;
    ruangan: string;
    dosenPengajar: string;
}

export interface IApiKrsHistoryResponse {
    krs: IKrsHistoryCourse[];
    totalSks: number;
    batasSks: number;
}

// IAcademicPeriod now lives in common.types.ts (single source of truth).

export interface IMataKuliah {
    id: string;
    siakTahunKurikulumId: string;
    nama: string;
    kode: string;
    semester: number;
    nilaiMin: string;
    totalSks: number;
    tahunKurikulum?: {
        id: string;
        tahun: string;
    };
    prasyarat1?: any;
    prasyarat2?: any;
    prasyarat3?: any;
}

export interface IAvailableCourse {
    id: string;
    siakMataKuliahId: string;
    nama: string; // Nama Kelas (e.g. Reguler A)
    kapasitas: number;
    sistemKuliah: string;
    jumlahPeminat?: number | null;
    mataKuliah: IMataKuliah;
    jadwalKuliah: {
        id: string;
        hari: string;
        jamMulai: string;
        jamSelesai: string;
        dosen: {
            id: string;
            nama: string;
            nidn: string;
        };
        ruangan: {
            id: string;
            nama: string;
        };
    }[];
    previousGrade?: string | null;
    rincianId?: string;
}

export interface IKrsInfo {
    statusKrs: "Belum Diajukan" | "Disetujui" | "Ditolak" | "Menunggu Persetujuan" | "Draft";
    semester: number;
    batasSks: number;
    periodeAkademik: string;
    pembimbingAkademik: string;
}

export interface IAddKrsPayload {
    kelasKuliahIds: string[];
}

export interface ISavedKrsResponse {
    krs: IAvailableCourse[];
    totalSks: number;
}


export interface IKhsCourse {
    id: string;
    kehadiran: string;
    tugas: string;
    uts: string;
    uas: string;
    nilai: string;
    hurufMutu: string;
    angkaMutu: string;
    nilaiAkhir: string;
    kelasKuliah: {
        id: string;
        nama: string;
        mataKuliah: {
            nama: string;
            kode: string;
            totalSks: number;
        };
    };
}

export interface IKhsData {
    hasilStudi: {
        semester: number;
        ips: string;
        ipk: string;
        sksDiambil: number;
        sksLulus: number;
    };
    rincianKrs: IKhsCourse[];
}

// This matches one course object from the "rincianKrsDto" array
export interface ITranscriptCourse {
    namaMataKuliah: string;
    kodeMataKuliah: string;
    sks: number;
    hurufMutu: string;
    angkaMutu: number;
    jumlahAngkaMutu: number;
    semester: number;
}

// This matches the flat response items from the new transcript endpoint
export interface IApiTranscriptItem {
    id: string;
    kehadiran: string | null;
    tugas: string | null;
    uts: string | null;
    uas: string | null;
    nilai: string | null;
    hurufMutu: string | null;
    angkaMutu: string | null;
    nilaiAkhir: string | null;
    siakKelasKuliahId: string;
    "krsMahasiswa.semester": number;
    "kelasKuliah.mataKuliah.id": string | null;
    "kelasKuliah.mataKuliah.nama": string | null;
    "kelasKuliah.mataKuliah.kode": string | null;
    "kelasKuliah.mataKuliah.totalSks": number | null;
    "kelasKuliah.mataKuliah.nilai_min": string | null;
    krsMahasiswa?: {
        semester: number;
    };
    kelasKuliah?: {
        id?: string | null;
        mataKuliah?: {
            id?: string | null;
            nama?: string | null;
            kode?: string | null;
            totalSks?: number | null;
            nilai_min?: string | null;
        };
    };
}

// This matches the main "data" object from the API response
export interface ITranscriptData {
    rincianKrsDto: ITranscriptCourse[];
    ipk: number;
    totalSks: number;
}

export interface IJadwalMataKuliah {
    hari: string,
    jamMulai: string,
    jamSelesai: string
}


export interface IJadwalKuliah {
    namaMataKuliah: string;
    kodeMataKuliah: string;
    jamMulai: string;
    jamSelesai: string;
    kelas: string;
    ruangan: string;
    dosen: string;
}

export interface IJadwalMingguan {
    senin?: IJadwalKuliah[];
    selasa?: IJadwalKuliah[];
    rabu?: IJadwalKuliah[];
    kamis?: IJadwalKuliah[];
    jumat?: IJadwalKuliah[];
    sabtu?: IJadwalKuliah[];
    [key: string]: any;
}

export interface IGrafikAkademik {
    ipk: number;
    ips: number[];
    mataKuliahKumulatif: number;
    sksKumulatif: number;
}

export interface IInfoTagihan {
    totalTagihan: number;
    totalLunas: number;
    sisaTagihan: number;
    tanggalTenggat: string;
}

export interface ITagihan {
    kodeInvoice: string;
    metodeBayar: string | null;
    namaPeriode: string;
    tanggalTenggat: string;
    tanggalBayar: string | null;
    kodeKomponen: string;
    namaTagihan: string;
    nominalTagihan: number;
    lunas: 'lunas' | 'belum lunas';
}

export interface ITagihanDetail extends ITagihan {
    // You can extend this with more specific student info if the API provides it
    studentInfo: {
        nim: string;
        nama: string;
        programStudi: string;
    };
}

export interface PaginatedBillsResponse {
    data: ITagihan[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

export interface KeluargaMahasiswa {
    id: string;
    hubungan: string;
    nama: string;
    nik: string;
    tanggalLahir: string;
    statusHidup: string;
    statusKerabat: string;
    pendidikan: string;
    pekerjaan: string;
    penghasilan: string;
    alamat: string;
    noTelepon: string;
    email: string;
}

export interface MahasiswaProfile {
    id: string;
    namaProgramStudi: string;
    nama: string;
    npm: string;
    periodeMasuk: string;
    kurikulum: string | null;
    sistemKuliah: string;
    kelas: string;
    jenisPendaftaran: string;
    jalurPendaftaran: string;
    gelombang: string;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: string;
    noKk: string;
    nik: string;
    angkatan: string;
    tanggalMasuk: string;
    kebutuhanKhusus: boolean;
    statusMahasiswa: string;
    alamatKtp: string;
    rtKtp: number;
    rwKtp: number;
    semester: number;
    desaKtp: string;
    provinsiKtp: string;
    kodePosKtp: string;
    statusTinggalKtp: string;
    alamatDomisili: string;
    rtDomisili: number;
    rwDomisili: number;
    desaDomisili: string;
    provinsiDomisili: string;
    kodePosDomisili: string;
    statusTinggalDomisili: string;
    noTelepon: string;
    noHp: string;
    emailPribadi: string;
    emailKampus: string;
    noTerdaftar: string;
    pendidikanAsal: string;
    provinsiSekolah: string;
    kotaKabSekolah: string;
    namaPendidikanAsal: string;
    alamatSekolah: string;
    teleponSekolah: string;
    noIjazahSekolah: string;
    jenjang: string;
    agama: string | null;
    beratBadan: number | null;
    tinggiBadan: number | null;
    golonganDarah: string | null;
    nisn: string | null;
    sks: number | null;
    ipk: number | null;
    keluargaMahasiswaList: KeluargaMahasiswa[];
}