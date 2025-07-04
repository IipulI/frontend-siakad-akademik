// hooks/useFetchComponentBill.ts
import { json } from "stream/consumers";
import { Api } from "../../api/Index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "http";

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

export interface CreateKeluargaMahasiswa {
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

export interface CreateStudentData {
  siakProgramStudiId: string;
  nama: string;
  angkatan: string;
  kurikulum: string;
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
  tanggalMasuk: string;
  kebutuhanKhusus: boolean;
  statusMahasiswa: string;
  alamatKtp: string;
  rtKtp: number;
  rwKtp: number;
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
  semester: number;
  dusunRt: string;
  kotaRt: string;
  kecamatanRt: string;
  dusunDomisili: string;
  kotaDomisili: string;
  kecamatanDomisili: string;
  agama: string;
  beratBadan: string;
  tinggiBadan: string;
  golonganDarah: string;
  transportasi: string;
  kewarganegaraan: string;
  paspor: string;
  statusNikah: string;
  ukuranJasAlmamater: string;
  pekerjaan: string;
  instansiPekerjaan: string;
  penghasilan: string;
  noRekening: string;
  namaRekening: string;
  namaBank: string;
  nisn: string;
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

// POST - Create Student Hook
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createStudent"],
    mutationFn: async (data: {
      fotoProfil?: File;
      ijazahSekolah?: File;
      request: string; // JSON string as shown in the API
      requestKeluarga: string; // JSON string as shown in the API
    }) => {
      const formData = new FormData();

      // Append files if provided
      if (data.fotoProfil) {
        formData.append("fotoProfil", data.fotoProfil);
      }

      if (data.ijazahSekolah) {
        formData.append("ijazahSekolah", data.ijazahSekolah);
      }

      // Append the request JSON string
      formData.append("request", data.request);
      formData.append("requestKeluarga", data.requestKeluarga);

      // Send as multipart/form-data
      const response = await Api.post("/akademik/mahasiswa", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    },
    onSuccess: (data) => {
      console.log("Student created successfully:", data);
      // Invalidate pagination queries
      queryClient.invalidateQueries({ queryKey: ["getStudent"] });
    },
    onError: (error) => {
      console.error("Error creating student:", error);
    },
  });
}

// DELETE
export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await Api.delete(`/akademik/mahasiswa/${id}`);
    },
    onSuccess: () => {
      // Invalidate pagination queries
      queryClient.invalidateQueries({ queryKey: ["getStudent"] });
    },
  });
}

// GET
export function getFotoProfil(id: string) {
  return useQuery<string>({
    queryKey: ["foto", id],
    queryFn: async () => {
      try {
        const response = await Api.get(`/akademik/mahasiswa/${id}/foto-profil`);
        return response.data.data;
      } catch (error) {
        // Handle specific cases where photo might not exist
        if (error.response?.status === 404) {
          return null; // or return a default photo URL
        }
        throw error;
      }
    },
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// PUT - Update Student Hook
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateStudent"],
    mutationFn: async (data: {
      id: string; // Student ID untuk parameter path
      fotoProfil?: File;
      ijazahSekolah?: File;
      request: string; // JSON string as shown in the API
    }) => {
      const formData = new FormData();

      // Append files if provided
      if (data.fotoProfil) {
        formData.append("fotoProfil", data.fotoProfil);
      }

      if (data.ijazahSekolah) {
        formData.append("ijazahSekolah", data.ijazahSekolah);
      }

      // Append the request JSON string
      formData.append("request", data.request);

      // Send as multipart/form-data with student ID in URL
      const response = await Api.put(
        `/akademik/mahasiswa/${data.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data;
    },
    onSuccess: (data, variables) => {
      console.log("Student updated successfully:", data);
      // Invalidate pagination queries
      queryClient.invalidateQueries({ queryKey: ["getStudent"] });
      // Optionally invalidate specific student query
      queryClient.invalidateQueries({ queryKey: ["getStudent", variables.id] });
    },
    onError: (error) => {
      console.error("Error updating student:", error);
    },
  });
}
