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

export interface IAcademicPeriod {
    id: string | number;
    namaPeriode: string;
}

export interface IMataKuliah {
    id: string;
    programStudi: string;
    tahunKurikulum: string;
    semester: string;
    nilaiMin: string;
    sksTatapMuka: number;
    sksPraktikum: number;
    adaPraktikum: boolean;
    opsiMataKuliah: boolean;
    kodeMataKuliah: string;
    namaMataKuliah: string;
    jenisMataKuliah: string;
}

export interface IAvailableCourse {
    id: string;
    mataKuliah: IMataKuliah;
    namaKelas: string;
    hari: string | null;
    jamMulai: string;
    jamSelesai: string;
    dosenPengajar: string;
    riwayatMatakuliah: string | null;
}

export interface IKrsInfo {
    statusKrs: "Belum Diajukan" | "Disetujui" | "Ditolak" | "Menunggu Persetujuan";
    semester: number;
    batasSks: number;
    periodeAkademik: string;
    pembimbingAkademik: string;
}

export interface IAddKrsPayload {
    kelasIds: string[];
}

export interface ISavedKrsResponse {
    krs: IAvailableCourse[];
    totalSks: number;
}


// Matches one item in the "rincianKrsDto" array
export interface IKhsCourse {
    namaMataKuliah: string;
    kodeMataKuliah: string;
    sks: number;
    hurufMutu: string;
    angkaMutu: number;
    jumlahAngkaMutu: number;
}

// Matches the "data" object in the API response
export interface IKhsData {
    rincianKrsDto: IKhsCourse[];
    ips: number;
}

// This matches one course object from the "rincianKrsDto" array
export interface ITranscriptCourse {
    namaMataKuliah: string;
    kodeMataKuliah: string;
    sks: number;
    hurufMutu: string;
    angkaMutu: number;
    jumlahAngkaMutu: number;
}

// This matches the main "data" object from the API response
export interface ITranscriptData {
    rincianKrsDto: ITranscriptCourse[];
    ipk: number;
    totalSks: number;
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
    senin: IJadwalKuliah[];
    selasa: IJadwalKuliah[];
    rabu: IJadwalKuliah[];
    kamis: IJadwalKuliah[];
    jumat: IJadwalKuliah[];
    sabtu: IJadwalKuliah[];
}