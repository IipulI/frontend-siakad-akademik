import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

interface StudentInfo {
  nim: string;
  namaMahasiswa: string;
  programStudi: string;
  statusMahasiwa: string;
  angkatan: string;
  tahunKurikulum: string;
  semester: number;
  pembimbingAkademik: string;
  sksLulus: number;
  totalSks: number;
  ipkLulus: number;
  ipk: number;
}

// GET
export function getStudentInfo(id: string) {
  return useQuery<StudentInfo>({
    queryKey: ["studentInfo", id],
    queryFn: async () => {
      const response = await Api.get(`/akademik/mahasiswa/${id}/info`);
      return response.data.data;
    },
  });
}

interface StatusSemesterData {
  kodePeriode: string;
  semester: number;
  status: string;
  sks: number;
  sksTempuh: number;
  sksLulus: number;
  sksTotal: number;
  ips: number;
  ipk: number;
  dosen: string;
}

interface KemajuanBelajarData {
  perkuliahan: {
    sksDiambilPerSemester: {
      semester: number;
      sks: number;
    }[];
    zonaPeringatan: {
      startSemester: number;
    };
    zonaDropOut: {
      startSemester: number;
    };
  };
  progresSks: {
    batasLulus: number;
    sksLulusKumulatif: {
      semester: number;
      sks: number;
    }[];
  };
  sksTempuh: {
    lulus: number;
    belumLulus: number;
    total: number;
  };
  indeksPrestasi: {
    ipMinimum: number;
    riwayat: {
      semester: number;
      ips: number;
      ipk: number;
    }[];
  };
  distribusiNilai: {
    detail: {
      grade: string;
      sks: number;
    }[];
  };
}

// GET
export function getStatusSemester(mahasiswaId: string) {
  return useQuery<StatusSemesterData>({
    queryKey: ["statusSemester", mahasiswaId],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/mahasiswa/status-semester/${mahasiswaId}`
      );
      return response.data.data;
    },
  });
}

// GET
export function getLearningProgres(mahasiswaId: string) {
  return useQuery<KemajuanBelajarData>({
    queryKey: ["kemajuanBelajar", mahasiswaId],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/mahasiswa/${mahasiswaId}/kemajuan-belajar`
      );
      return response.data.data;
    },
  });
}

interface Transkip {
  rincianKrsDto: {
    namaMataKuliah: string;
    kodeMataKuliah: string;
    sks: number;
    hurufMutu: string;
    angkaMutu: number;
    semester: number;
    jumlahAngkaMutu: number;
  }[];
  ipk: number;
  totalSks: number;
  totalAngkaMutu: number;
}

// GET
export function getTranskip(mahasiswaId: string) {
  return useQuery<Transkip>({
    queryKey: ["transkip", mahasiswaId],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/mahasiswa/transkip/${mahasiswaId}`
      );
      return response.data.data;
    },
  });
}

interface NilaiKuliah {
  tahunKurikulum: string;
  kodeMataKuliah: string;
  namaMataKuliah: string;
  namaKelas: string;
  komposisiNilaiMataKuliahResDto: {
    namaKomposisi: string;
    persentase: number;
    nilai: number;
  }[];
  nilai: number;
  nilaiAkhir: number;
}

// GET
export function getNilaiKuliah(mahasiswaId: string, namaPeriode: string) {
  return useQuery<NilaiKuliah[]>({
    queryKey: ["nilaiKuliah", mahasiswaId, namaPeriode],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/mahasiswa/${mahasiswaId}/komposisi-nilai`,
        {
          params: {
            namaPeriode,
          },
        }
      );
      return response.data.data;
    },
  });
}

interface Krs {
  krs: {
    kodeMataKuliah: string;
    namaMataKuliah: string;
    kelas: string;
    sks: number;
    hari: string;
    jam: string;
    ruangan: string;
    dosenPengajar: string;
  }[];
  totalSks: number;
  batasSks: number;
}

// GET
export function getKrs(mahasiswaId: string, namaPeriode: string) {
  return useQuery<Krs>({
    queryKey: ["krs", mahasiswaId, namaPeriode],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/mahasiswa/riwayat-krs/${mahasiswaId}`,
        {
          params: {
            namaPeriode,
          },
        }
      );
      return response.data.data;
    },
  });
}
interface Mengulang {
  namaMataKuliah: string;
  kodeMataKuliah: string;
  periode: {
    periodeAkademik: string;
    sks: number;
    semester: number;
    nilai: string;
  }[];
}

// GET
export function getMengulang(mahasiswaId: string, periodeAkademikId: string) {
  return useQuery<Mengulang[]>({
    queryKey: ["mengulang", mahasiswaId, periodeAkademikId],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/mahasiswa/mengulang/${mahasiswaId}`,
        {
          params: {
            periodeAkademikId,
          },
        }
      );
      return response.data.data;
    },
  });
}

interface SuntingKrs {
  id: string;
  kurikulum: number;
  kodeMataKuliah: string;
  namaMataKuliah: string;
  namaKelas: string;
  sks: number;
  nilaiNumerik: number;
  nilaiHuruf: string;
  nilaiMutu: number;
  valid: boolean;
  lulus: boolean;
}

// GET
export function getSuntingKrs(mahasiswaId: string, namaPeriode: string = "") {
  return useQuery<SuntingKrs[]>({
    queryKey: ["suntingKrs", mahasiswaId, namaPeriode],
    queryFn: async () => {
      // Buat object params dengan parameter required
      const params: any = {};

      if (namaPeriode.trim()) params.namaPeriode = namaPeriode.trim();

      const response = await Api.get(
        `/akademik/mahasiswa/sunting-krs/${mahasiswaId}`,
        {
          params,
        }
      );
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });
}

// DELETE
export function delSuntingDetail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mahasiswaId: string) => {
      await Api.delete(`/akademik/mahasiswa/krs/${mahasiswaId}`);
    },
  });
}

interface FinalisasiMk {
  periodeAkademik: string;
  kurikulum: string;
  kodeMataKuliah: string;
  namaMatakuliah: string;
  sks: number;
  opsiMataKuliah: boolean;
  grade: string;
  status: string;
  dipakai: boolean;
  transkip: boolean;
}

// GET
export function getFinalisasiMk(mahasiswaId: string) {
  return useQuery<FinalisasiMk[]>({
    queryKey: ["finalisasiMk", mahasiswaId],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/mahasiswa/finalisasi-mk/${mahasiswaId}`
      );
      return response.data.data;
    },
  });
}

interface Khs {
  rincianKrsDto: {
    namaMataKuliah: string;
    kodeMataKuliah: string;
    sks: number;
    semester: number;
    hurufMutu: string;
    angkaMutu: number;
    jumlahAngkaMutu: number;
  }[];
  ips: number;
}

// GET
export function getKhs(mahasiswaId: string, periodeAkademikId: string) {
  return useQuery<Khs>({
    queryKey: ["khs", mahasiswaId, periodeAkademikId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/mahasiswa/khs/${mahasiswaId}`, {
        params: {
          periodeAkademikId,
        },
      });
      return response.data.data;
    },
  });
}

interface ActiveBill {
  kodeInvoice: string;
  metodeBayar: string;
  namaPeriode: string;
  tanggalTenggat: string;
  tanggalBayar: string;
  kodeKomponen: string;
  namaTagihan: string;
  nominalTagihan: number;
  lunas: string;
}

// GET
export function getActiveBill(mahasiswaId: string, namaPeriode: string = "") {
  return useQuery<ActiveBill[]>({
    queryKey: ["activeBill", mahasiswaId, namaPeriode],
    queryFn: async () => {
      // Buat object params dengan parameter required
      const params: any = {};

      if (namaPeriode.trim()) params.namaPeriode = namaPeriode.trim();

      const response = await Api.get(
        `/akademik/mahasiswa/tagihan-aktif/${mahasiswaId}`,
        {
          params,
        }
      );
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });
}

// Interface untuk data edit KRS - hanya nilaiNumerik
interface EditKrsData {
  krsId: string;
  nilaiNumerik: number;
}

// Hook untuk edit KRS
export function useEditKrs() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["editKrs"],
    mutationFn: async (data: EditKrsData) => {
      const response = await Api.put(
        `/akademik/mahasiswa/sunting-krs/update/${data.krsId}`,
        {
          nilaiNumerik: data.nilaiNumerik,
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["getSuntingKrs"] });
      queryClient.invalidateQueries({ queryKey: ["getStudentData"] });
    },
  });
}
