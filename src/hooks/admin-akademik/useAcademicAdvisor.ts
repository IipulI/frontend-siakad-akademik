import { PaginationResponse } from "./../admin-keuangan/useStudentBill";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index.tsx";

export interface IAcademicAdvisor {
  id: string;
  mahasiswa: string;
  angkatan: string;
  statusMahasiswa: string;
  semester: number;
  batasSks: number;
  totalSks: number;
  ipk: number;
  ips: number;
  statusDiajukan: boolean;
  statusDisetujui: boolean;
  pembimbingAkademik: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

interface AcademicAdvisorParams {
  periodeAkademik: string;
  programStudi?: string;
  angkatan?: string;
  statusKrs?: string;
  namaMahasiswa?: string;
  hasPembimbing?: boolean;
  statusMahasiswa?: string;
  page: number;
  size: number;
}

export function getAcademicAdvisor(filters: AcademicAdvisorParams) {
  return useQuery({
    queryKey: ["courseData", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.periodeAkademik && filters.periodeAkademik !== "all") {
        params.append("periodeAkademik", filters.periodeAkademik);
      }
      if (filters.programStudi && filters.programStudi !== "all") {
        params.append("programStudi", filters.programStudi);
      }
      if (filters.angkatan && filters.angkatan !== "all") {
        params.append("angkatan", filters.angkatan);
      }
      if (filters.statusKrs && filters.statusKrs !== "all") {
        params.append("statusKrs", filters.statusKrs);
      }
      if (filters.hasPembimbing) {
        params.append("hasPembimbing", String(filters.hasPembimbing));
      }
      if (filters.statusMahasiswa && filters.statusMahasiswa !== "all") {
        params.append("statusMahasiswa", filters.statusMahasiswa);
      }

      params.append("page", String(filters.page - 1));
      params.append("size", String(filters.size));
      params.append("sort", "createdAt,desc");

      const response = await Api.get(`/akademik/pembimbing-akademik/all?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      return response.data.data as PaginatedResponse<IAcademicAdvisor>;
    },

    enabled: true,
  });
}
