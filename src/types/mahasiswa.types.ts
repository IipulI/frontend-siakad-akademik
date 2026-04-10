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
    jadwalKuliah: IJadwalMataKuliah[]
}

export interface IKrsInfo {
    statusKrs: "Belum Diajukan" | "Disetujui" | "Ditolak" | "Menunggu Persetujuan" | "Draft";
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
    senin: IJadwalKuliah[];
    selasa: IJadwalKuliah[];
    rabu: IJadwalKuliah[];
    kamis: IJadwalKuliah[];
    jumat: IJadwalKuliah[];
    sabtu: IJadwalKuliah[];
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