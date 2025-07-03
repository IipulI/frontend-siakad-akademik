import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface CourseData {
  id: string;
  programStudi: string;
  tahunKurikulum: string;
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
  prasyaratMataKuliah1Id?: string;
  prasyaratMataKuliah2Id?: string;
  prasyaratMataKuliah3Id?: string;
  prasyaratMataKuliah1?: {
    id: string;
    kodeMataKuliah: string;
    namaMataKuliah: string;
  };
  prasyaratMataKuliah2?: {
    id: string;
    kodeMataKuliah: string;
    namaMataKuliah: string;
  };
  prasyaratMataKuliah3?: {
    id: string;
    kodeMataKuliah: string;
    namaMataKuliah: string;
  };
}

interface CourseFilters {
  tahunKurikulum: string;
  jenisMataKuliah: string;
  programStudi: string;
}

export function getCourseData(filters: CourseFilters) {
  return useQuery({
    queryKey: ["courseData", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.tahunKurikulum && filters.tahunKurikulum !== "all") {
        params.append("tahunKurikulum", filters.tahunKurikulum);
      }
      if (filters.programStudi && filters.programStudi !== "all") {
        params.append("programStudi", filters.programStudi);
      }
      if (filters.jenisMataKuliah && filters.jenisMataKuliah !== "all") {
        params.append("jenisMataKuliah", filters.jenisMataKuliah);
      }

      params.append("page", "1");
      params.append("size", "100");
      params.append("sort", "createdAt,desc");

      const response = await Api.get(`/akademik/mata-kuliah?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      return response.data.data;
    },

    enabled: true,
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

// --- mutation for add course ---
export function useAddCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCourseData: Omit<CourseData, "id">) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const payload = {
        siakProgramStudiId: newCourseData.siakProgramStudiId,
        siakTahunKurikulumId: newCourseData.siakTahunKurikulumId,
        sksTatapMuka: newCourseData.sksTatapMuka,
        sksPraktikum: newCourseData.sksPraktikum,
        semester: newCourseData.semester,
        adaPraktikum: newCourseData.adaPraktikum,
        nilaiMin: newCourseData.nilaiMin,
        kodeMataKuliah: newCourseData.kodeMataKuliah,
        namaMataKuliah: newCourseData.namaMataKuliah,
        jenisMataKuliah: newCourseData.jenisMataKuliah,
        prasyaratMataKuliah1Id: newCourseData.prasyaratMataKuliah1Id || "",
        prasyaratMataKuliah2Id: newCourseData.prasyaratMataKuliah2Id || "",
        prasyaratMataKuliah3Id: newCourseData.prasyaratMataKuliah3Id || "",
      };

      const response = await Api.post("/akademik/mata-kuliah", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newItemData = response.data?.data || response.data;
      return {
        id: newItemData.id,
        tahunKurikulum: newItemData.tahunKurikulum,
        programStudi: newItemData.programStudi,
        siakProgramStudiId: newItemData.siakProgramStudiId,
        siakTahunKurikulumId: newItemData.siakTahunKurikulumId,
        sksTatapMuka: newItemData.sksTatapMuka,
        sksPraktikum: newItemData.sksPraktikum,
        semester: newItemData.semester,
        adaPraktikum: newItemData.adaPraktikum,
        nilaiMin: newItemData.nilaiMin,
        kodeMataKuliah: newItemData.kodeMataKuliah,
        namaMataKuliah: newItemData.namaMataKuliah,
        jenisMataKuliah: newItemData.jenisMataKuliah,
        opsiMataKuliah: newItemData.opsiMataKuliah,
        prasyaratMataKuliah1Id: newItemData.prasyaratMataKuliah1Id,
        prasyaratMataKuliah2Id: newItemData.prasyaratMataKuliah2Id,
        prasyaratMataKuliah3Id: newItemData.prasyaratMataKuliah3Id,
      };
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
