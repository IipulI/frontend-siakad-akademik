import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";
import { useMemo } from "react";
import { useDebounce } from "use-debounce";

export interface CollegeClass {
  id: string;
  dosen: string[];
  jadwalMingguan: string[];
  jumlahPertemuan: number;
  kapasitas: number;
  mataKuliah: {
    id: string;
    kodeMataKuliah: string;
    namaMataKuliah: string;
    tahunKurikulum: string;
  };
  nama: string;
  periodeAkademik: string;
  peserta: number;
  programStudi: {
    id: string;
    jenjang: {
      id: string;
      jenjang: string;
      nama: string;
    };
    namaProgramStudi: string;
  };
  sistemKuliah: string;
  statusPenilaian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

export interface CreateCollegeClassPayload {
  periode_akademik_id: string;
  sistem_kuliah: string;
  program_studi_id: string;
  tahun_kurikulum_id: string;
  kapasitas: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  mata_kuliah: string;
  nama_kelas: string;
  jumlah_pertemuan: number;
  jadwal_mingguan: {
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    jenis_pertemuan: string;
    metode_pembelajaran: string;
    ruang: string;
  }[];
}

export interface LecturerSchedulePayload {
  jadwal: {
    dosenId: string;
    jadwalIds: string[];
  }[];
}

export function getCollegeClass(filter: {
  periodeAkademik?: string;
  programStudi?: string;
  tahunKuriKulum?: string;
}) {
  // Debounce selama 500ms
  const [debouncedFilter] = useDebounce(filter, 500);

  // Optional: gunakan useMemo agar queryKey lebih stabil
  const queryKey = useMemo(
    () => ["classes", debouncedFilter],
    [debouncedFilter]
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await Api.get("/akademik/kelas-kuliah", {
        params: debouncedFilter,
      });
      return response.data.data;
    },
  });
}

export function addCollegeClass() {
  return useMutation({
    mutationKey: ["addCollegeClass"],
    mutationFn: async (newClassData: CollegeClass) => {
      const response = await Api.post("/akademik/kelas-kuliah", newClassData);
      return response.data.data;
    },
  });
}

export function addLecturerSchedule(id) {
  return useMutation({
    mutationFn: async (data: LecturerSchedulePayload) => {
      const response = await Api.put(
        `/akademik/kelas-kuliah/${id}/jadwal-dosen`,
        data
      ); // Ubah jadi PUT
      return response.data.data;
    },
  });
}

export function addStudentToClass(id) {
  return useMutation({
    mutationFn: async (data) => {
      const response = await Api.post(
        `/akademik/kelas-kuliah/${id}/peserta-kelas`,
        data
      ); // Ubah jadi PUT
      return response.data.data;
    },
  });
}

export function getDetailCollegeClass(id: string) {
  return useQuery({
    queryKey: ["collegeClassDetail", id],
    queryFn: async () => {
      const response = await Api.get(`/akademik/kelas-kuliah/${id}`);
      return response.data.data;
    },
  });
}

export function getClassAttendants(id: string) {
  return useQuery({
    queryKey: ["classAttendants"],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/kelas-kuliah/${id}/peserta-kelas`
      );
      return response.data.data;
    },
  });
}

export function getClassRPS(id: string) {
  return useQuery({
    queryKey: ["classRPS"],
    queryFn: async () => {
      const response = await Api.get(`/akademik/kelas-kuliah/${id}/kelas-rps`);
      return response.data.data;
    },
  });
}

export function getClassesGrades(id: string) {
  return useQuery({
    queryKey: ["classesGrades"],
    queryFn: async () => {
      const response = await Api.get(`/akademik/kelas-kuliah/${id}/penilaian`);
      return response.data.data;
    },
  });
}

export function getYearCuriculum() {
  return useQuery({
    queryKey: ["curiculumYear"],
    queryFn: async () => {
      const response = await Api.get("/akademik/tahun-kurikulum");
      return response.data.data;
    },
  });
}

export function getSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await Api.get("/akademik/mata-kuliah");
      return response.data.data;
    },
  });
}
export function getRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await Api.get("/akademik/ruangan");
      return response.data.data;
    },
  });
}

export function getLecturers() {
  return useQuery({
    queryKey: ["lecturers"],
    queryFn: async () => {
      const response = await Api.get("/akademik/dosen");
      return response.data.data;
    },
  });
}

export function getLecturerSchedule(id) {
  return useQuery({
    queryKey: ["lecturerSchedule"],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/kelas-kuliah/${id}/jadwal-dosen`
      );
      return response.data.data;
    },
  });
}

export function getStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await Api.get("/akademik/mahasiswa");
      return response.data.data;
    },
  });
}

export function getAllDetailStudentAttendant(id) {
  return useQuery({
    queryKey: ["allDetailStudent"],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/kelas-kuliah/${id}/peserta-kelas`
      );
      return response.data.data;
    },
  });
}

export const deleteStudentsFromClass = (kelasId: string) => {
  return useMutation({
    mutationFn: async ({ mahasiswaIds }: { mahasiswaIds: string[] }) => {
      const response = await Api.delete(
        `/akademik/kelas-kuliah/${kelasId}/peserta-kelas`,
        {
          data: { mahasiswaIds }, // axios needs `data` key for DELETE body
        }
      );
      return response.data;
    },
  });
};

export const getStudentExams = (id) => {
  return useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const response = await Api.get(
        `/akademik/kelas-kuliah/${id}/jadwal-ujian`
      );
      return response.data.data;
    },
  });
};
