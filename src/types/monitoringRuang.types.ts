// src/types/monitoringRuang.types.ts

export type JenisKegiatanRuang = "perkuliahan";

export interface IJadwalMonitoringRuang {
  id: string;
  jenisKegiatan: JenisKegiatanRuang;
  jamMulai: string; // "HH:mm:ss"
  jamSelesai: string; // "HH:mm:ss"
  jenisPertemuan: string | null;
  metodePembelajaran: string | null;
  kelas: {
    id: string;
    nama: string;
    sistemKuliah: string | null;
    mataKuliah: {
      id: string;
      nama: string;
      kode: string;
      totalSks: number;
    };
    programStudi: {
      id: string;
      nama: string;
    };
  };
  dosen: {
    id: string;
    nama: string;
    nidn: string | null;
  } | null;
}

export interface IRuanganMonitoring {
  id: string;
  kode: string;
  nama: string;
  kapasitas: number;
  lantai: number;
  fakultas: { id: string; nama: string } | null;
  programStudi: { id: string; nama: string } | null;
  status: "terpakai" | "kosong";
  jadwal: IJadwalMonitoringRuang[];
}

export interface IMonitoringRuanganMeta {
  total: number;
  perPage: number;
  currentPage: number;
  totalPage: number;
  ruanganTerpakai: number;
  ruanganKosong: number;
}

export interface IMonitoringRuanganResponse {
  tanggal: string;
  hari: string;
  ruangan: IRuanganMonitoring[];
  meta: IMonitoringRuanganMeta;
}
