// src/types/administrasi.types.ts
// Tipe data untuk menu Perkuliahan > Administrasi (Mahasiswa Pindahan, Transfer,
// Keluar, Evaluasi Mahasiswa, Status Semester). Saat ini datanya masih static/dummy.

export interface IMahasiswaPindahan {
  id: string;
  nim: string;
  nama: string;
  periodeMasuk: string;
  jenjang: string;
  programStudi: string;
  jenisPindahan: string;
  perguruanTinggiAsal: string;
  prodiAsal: string;
  ipkAsal: number;
  sksDiakui: number;
  sksTransfer: number;
  statusNilaiTransfer: "Belum Dikonversi" | "Sudah Dikonversi" | "Valid";
}

export interface IMahasiswaTransfer {
  id: string;
  nim: string;
  nama: string;
  programStudi: string;
  kodeMkAsal: string;
  namaMkAsal: string;
  sksAsal: number;
  nilaiHurufAsal: string;
  mataKuliahKonversi: string;
  nilaiKonversi: string;
  valid: boolean;
}

export interface IMahasiswaKeluar {
  id: string;
  nim: string;
  nama: string;
  programStudi: string;
  angkatan: string;
  periodeAkmTerakhir: string;
  statusKeluar: string;
  noSkKeluar: string;
  tanggalSk: string;
}

export interface IEvaluasiMahasiswa {
  id: string;
  nim: string;
  nama: string;
  jenjang: string;
  programStudi: string;
  periodeMasuk: string;
  masaStudi: string;
  semester: number;
  sksLulus: number;
  sksEvalMinimal: number;
  ipk: number;
  ipkEvalMinimal: number;
  statusEvaluasi: "Memenuhi" | "Tidak Memenuhi" | "Melebihi Masa Studi";
}

// Kartu ringkasan di bagian atas halaman Generate Status Semester
export interface IStatusSemesterStat {
  label: string;
  value: number;
  percentage: string;
  description: string;
}

// Satu baris pada tabel rekap Status Semester (per Universitas/Fakultas/Prodi).
// `level` dipakai untuk indentasi visual: 0 = Universitas, 1 = Fakultas, 2 = Program Studi.
export interface IStatusSemesterSummaryRow {
  id: string;
  namaUnit: string;
  level: 0 | 1 | 2;
  statusSemester: {
    aktif: number;
    nonAktif: number;
    cuti: number;
    doubleDegree: number;
    kampusMerdeka: number;
    ukom: number;
  };
  statusKrs: {
    belumDiajukan: number;
    belumDisetujui: number;
    sedangDiajukan: number;
    dropOut: number;
  };
  statusKelulusan: {
    keluar: number;
    lulus: number;
  };
  akmTidakSesuai: {
    aktif: number;
    lainnya: number;
  };
  melebihiBatasStudi: {
    adaAkm: number;
    tidakAdaAkm: number;
  };
}
