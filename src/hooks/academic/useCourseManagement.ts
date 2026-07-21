import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface CourseData {
  id: string;
  programStudi: { id: string; kode: string; nama: string };
  tahunKurikulum: { id: string; tahun: string };
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;
  semester: number;
  nilaiMin: string;
  sksTatapMuka: number;
  sksPraktikum: number;
  totalSks: number;
  adaPraktikum: boolean;
  opsiWajib: boolean;
  kode: string;
  nama: string;
  jenis: string;
  prasyaratMataKuliah1?: { id: string; kode: string; nama: string } | null;
  prasyaratMataKuliah2?: { id: string; kode: string; nama: string } | null;
  prasyaratMataKuliah3?: { id: string; kode: string; nama: string } | null;
}

export interface CoursePagination {
  currentPage: number;
  perPage: number;
  totalPage: number;
  totalItems: number;
}

export interface CourseResponse {
  data: CourseData[];
  pagination: CoursePagination;
}

export interface CourseParams {
  page?: number;
  size?: number;
  tahunKurikulum?: string;
  programStudi?: string;
  jenisMataKuliah?: string;
  search?: string;
}

export function getCourseData(params: CourseParams = {}) {
  const { page = 1, size = 10, tahunKurikulum, programStudi, jenisMataKuliah, search } = params;

  return useQuery<CourseResponse>({
    queryKey: ["courseData", page, size, tahunKurikulum, programStudi, jenisMataKuliah, search],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({
        page: String(page),
        size: String(size),
        sort: "createdAt,desc",
      });
      if (tahunKurikulum && tahunKurikulum !== "all") query.set("tahunKurikulum", tahunKurikulum);
      if (programStudi && programStudi !== "all") query.set("programStudiId", programStudi);
      if (jenisMataKuliah && jenisMataKuliah !== "all") query.set("jenisMataKuliah", jenisMataKuliah);
      if (search) query.set("search", search);

      const response = await Api.get(`/akademik/mata-kuliah?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    },
  });
}

export function getCourseDataById(id: string) {
  return useQuery({
    queryKey: ["courseEdit", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.get(`/akademik/mata-kuliah/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    },
    enabled: !!id,
  });
}

export interface AddCourseInput {
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;

  nama: string;
  kode: string;
  jenis: string;
  adaPraktikum: boolean;
  sksTatapMuka: number;
  sksPraktikum: number;
  sksPraktikLapangan: number;
  totalSks: number;

  prasyaratMataKuliah1?: string | null;
  prasyaratMataKuliah2?: string | null;
  prasyaratMataKuliah3?: string | null;
}

// --- mutation for add course ---
export function useAddCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddCourseInput) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const payload = {
        siakProgramStudiId: input.siakProgramStudiId,
        siakTahunKurikulumId: input.siakTahunKurikulumId,

        nama: input.nama,
        kode: input.kode,
        jenis: input.jenis,
        adaPraktikum: input.adaPraktikum,
        sksTatapMuka: input.sksTatapMuka,
        sksPraktikum: input.sksPraktikum,
        sksPraktikLapangan: input.sksPraktikLapangan,
        totalSks: input.totalSks,

        prasyaratMataKuliah1: input.prasyaratMataKuliah1 || null,
        prasyaratMataKuliah2: input.prasyaratMataKuliah2 || null,
        prasyaratMataKuliah3: input.prasyaratMataKuliah3 || null,
      };

      const response = await Api.post("/akademik/mata-kuliah", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data?.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseData"] });
    },
  });
}

// --- mutation for update course ---
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<CourseData, "id"> }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const payload = {
        siakProgramStudiId: data.siakProgramStudiId,
        siakTahunKurikulumId: data.siakTahunKurikulumId,
        sksTatapMuka: data.sksTatapMuka,
        sksPraktikum: data.sksPraktikum,
        semester: data.semester,
        adaPraktikum: data.adaPraktikum,
        nilaiMin: data.nilaiMin,
        kodeMataKuliah: data.kodeMataKuliah,
        namaMataKuliah: data.namaMataKuliah,
        jenisMataKuliah: data.jenisMataKuliah,
        prasyaratMataKuliah1Id: data.prasyaratMataKuliah1Id || "",
        prasyaratMataKuliah2Id: data.prasyaratMataKuliah2Id || "",
        prasyaratMataKuliah3Id: data.prasyaratMataKuliah3Id || "",
      };

      await Api.put(`/akademik/mata-kuliah/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseData"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      await Api.delete(`/akademik/mata-kuliah/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseData"] });
    },
  });
}
