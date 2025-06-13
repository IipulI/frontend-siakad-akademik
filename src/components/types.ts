export interface CurriculumData {
  id: string;
  mulaiBerlaku: string;
  tahun: string;
  keterangan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  siakPeriodeAkademikId: string;
}

export interface PeriodeAkademik {
  id: string;
  siakTahunAjaranId: "3fa85f64-5717-4562-b3fc-2c963f66afa6";
  namaPeriode: string;
  kodePeriode: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

export interface ProgramStudiData {
  id: string;
  namaProgramStudi: string;
  jenjang: string;
}

export interface GraduateProfileData {
  id: string;
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;
  profil: string;
  profesi: string;
  kodePl: string;
  deskripsiPl: string;
}

interface prasyaratMataKuliah1 {
  id: string;
  kodeMataKuliah: string;
  namaMataKuliah: string;
}

interface prasyaratMataKuliah2 {
  id: string;
  kodeMataKuliah: string;
  namaMataKuliah: string;
}

interface prasyaratMataKuliah3 {
  id: string;
  kodeMataKuliah: string;
  namaMataKuliah: string;
}

export interface CourseData {
  id: string;
  programStudi: string;
  tahunKurikulum: string;
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;
  semester: string;
  nilaiMin: string;
  sksTatapMuka: number;
  sksPraktikum: number;
  adaPraktikum: boolean;
  opsiMataKuliah: boolean;
  kodeMataKuliah: string;
  namaMataKuliah: string;
  jenisMataKuliah: string;
  prasyaratMataKuliah1Id?: string;
  prasyaratMataKuliah2Id?: string;
  prasyaratMataKuliah3Id?: string;
  prasyaratMataKuliah1?: prasyaratMataKuliah1;
  prasyaratMataKuliah2?: prasyaratMataKuliah2;
  prasyaratMataKuliah3?: prasyaratMataKuliah3;
}

export interface CplData {
  id: string;
  programStudi: string;
  tahunKurikulum: string;
  kodeCpl: string;
  deskripsiCpl: string;
  kategoriCpl: string;
  pemetaan: string;
}

export interface CpmkData {
  id: string;
  namaMataKuliah: string;
  kodeMataKuliah: string;
  mataKuliahId: string;
  tahunKurikulum: string;
  hasCpmk: string;
}

export interface DosenData {
  id: string;
  nama: string;
  nidn: string;
}

export interface KelasData {
  id: string;
  nama: string;
}

export interface RpsData {
  id: string;
  siakProgramStudiId: string;
  siakPeriodeAkademikId: string;
  siakTahunKurikulumId: string;
  siakMataKuliahId: string;
  dosenIds: string[];
  tahunKurikulum: CurriculumData;
  PeriodeAkademik: PeriodeAkademik;
  programStudi: ProgramStudiData;
  tanggalPenyusun: string;
  deskripsiMataKuliah: string;
  tujuanMataKuliah: string;
  materiPembelajaran: string;
  pustakaUtama: string;
  pustakaPendukung: string;
  dosenPenyusun: DosenData;
  mataKuliah: CourseData;
  kelas: KelasData;
  sks: number;
}

export interface CurriculumProdiData {
  id: string;
  semester: string;
  mataKuliah: CourseData;
  totalSks: number;
}
