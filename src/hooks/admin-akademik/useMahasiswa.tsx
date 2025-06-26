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
export function useStudentData(page: number = 1, size: number = 10) {
  return useQuery<PaginationResponse>({
    queryKey: ["getStudentData", page, size],
    queryFn: async () => {
      const response = await Api.get("/akademik/mahasiswa", {
        params: {
          page,
          size,
        },
      });
      return response.data;
    },
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
