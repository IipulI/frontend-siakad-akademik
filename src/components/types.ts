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

export interface GraduateProfileData {
  id: string;
  kodePl: string;
  profilLulusan: string;
  profesi: string;
  deskripsi: string;
}
