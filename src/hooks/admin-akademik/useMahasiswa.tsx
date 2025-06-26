// hooks/useFetchComponentBill.ts
import { Api } from "../../api/Index";
import { useQuery } from "@tanstack/react-query";

export interface StudentData {
  id: string;
  npm: string;
  nama: string;
  jenjang: number;
  namaProgramStudi: string;
  periodeMasuk: string;
  statusMahasiswa: string;
  semester: number;
  sks: string;
  ipk: string;
}

export interface PaginationResponse {
  status: string;
  message: string;
  data: StudentData[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// GET - dengan pagination
export function useStudentData(
  page: number = 1,
  size: number = 10,
  keyword: string = "",
  programStudi: string = "",
  jenisPendaftaran: string = "",
  kelasPerkuliahan: string = "",
  angkatan: string = "",
  jalurPendaftaran: string = "",
  statusMahasiswa: string = "",
  gelombang: string = "",
  jenisKelamin: string = "",
  sistemKuliah: string = "",
  kurikulum: string = "",
  periodeMasuk: string = "",
  periodeKeluar: string = ""
) {
  return useQuery<PaginationResponse>({
    queryKey: [
      "getStudentData",
      page,
      size,
      keyword,
      programStudi,
      jenisPendaftaran,
      kelasPerkuliahan,
      angkatan,
      jalurPendaftaran,
      statusMahasiswa,
      gelombang,
      jenisKelamin,
      sistemKuliah,
      kurikulum,
      periodeMasuk,
      periodeKeluar,
    ],
    queryFn: async () => {
      // Buat object params dan hanya tambahkan parameter yang tidak kosong
      const params: any = {
        page,
        size,
      };

      // Tambahkan parameter filter hanya jika ada nilainya
      if (keyword.trim()) params.keyword = keyword.trim();
      if (programStudi.trim()) params.programStudi = programStudi.trim();
      if (jenisPendaftaran.trim())
        params.jenisPendaftaran = jenisPendaftaran.trim();
      if (kelasPerkuliahan.trim())
        params.kelasPerkuliahan = kelasPerkuliahan.trim();
      if (angkatan.trim()) params.angkatan = angkatan.trim();
      if (jalurPendaftaran.trim())
        params.jalurPendaftaran = jalurPendaftaran.trim();
      if (statusMahasiswa.trim())
        params.statusMahasiswa = statusMahasiswa.trim();
      if (gelombang.trim()) params.gelombang = gelombang.trim();
      if (jenisKelamin.trim()) params.jenisKelamin = jenisKelamin.trim();
      if (sistemKuliah.trim()) params.sistemKuliah = sistemKuliah.trim();
      if (kurikulum.trim()) params.kurikulum = kurikulum.trim();
      if (periodeMasuk.trim()) params.periodeMasuk = periodeMasuk.trim();
      if (periodeKeluar.trim()) params.periodeKeluar = periodeKeluar.trim();

      const response = await Api.get("/akademik/mahasiswa", {
        params,
      });
      return response.data;
    },
    // Refetch ketika ada perubahan parameter
    refetchOnWindowFocus: false,
  });
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

export interface StudentDetail {
  id: string;
  namaProgramStudi: string;
  nama: string;
  npm: string;
  periodeMasuk: string;
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
  keluargaMahasiswaList: KeluargaMahasiswa[];
}

// GET - dengan pagination
export function useStudentDetail(id: string) {
  return useQuery<StudentDetail>({
    queryKey: ["getStudentDetail", id],
    queryFn: async () => {
      const response = await Api.get(`/akademik/mahasiswa/${id}`);
      return response.data.data;
    },
  });
}
