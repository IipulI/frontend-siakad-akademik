export interface CurriculumData {
  id: string;
  tahun: string;
  keterangan: string;
  siakPeriodeAkademikId: string;
  tanggalAwal: string;
  tanggalAkhir: string;
}

export interface PeriodeAkademik {
  id: string;
  namaPeriode: string;
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

export interface CourseData {
  id: string;
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
  prasyaratMataKuliah1?: string;
  prasyaratMataKuliah2?: string;
  prasyaratMataKuliah3?: string;
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
  kodeMataKuliah: string;
  namaMataKuliah: string;
  hasCpmk: string;
  mataKuliahId: string;
  tahunKurikulum: string;
}
