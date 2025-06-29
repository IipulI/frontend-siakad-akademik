import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

interface AcademicAdvisor {
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

export interface PaginationResponse {
  status: string;
  message: string;
  data: AcademicAdvisor[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// Interface untuk parameter hook
interface AcademicAdvisorParams {
  page?: number;
  size?: number;
  periodeAkademik: string; // Required parameter
  programStudi?: string;
  angkatan?: string;
  statusKrs?: string;
  namaMahasiswa?: string;
  hasPembimbing?: boolean;
  statusMahasiswa?: string;
  sort?: string;
}

// GET - dengan pagination dan semua parameter
export function useGetAcademicAdvisor({
  page = 1,
  size = 10,
  periodeAkademik, // Required
  programStudi = "",
  angkatan = "",
  statusKrs = "",
  namaMahasiswa = "",
  hasPembimbing,
  statusMahasiswa = "",
  sort = "createdAt,desc",
}: AcademicAdvisorParams) {
  return useQuery<PaginationResponse>({
    queryKey: [
      "getAcademicAdvisor",
      page,
      size,
      periodeAkademik,
      programStudi,
      angkatan,
      statusKrs,
      namaMahasiswa,
      hasPembimbing,
      statusMahasiswa,
      sort,
    ],
    queryFn: async () => {
      // Buat object params dengan parameter required
      const params: any = {
        page,
        size,
        periodeAkademik,
        sort,
      };

      // Tambahkan parameter filter hanya jika ada nilainya
      if (programStudi?.trim()) params.programStudi = programStudi.trim();
      if (angkatan?.trim()) params.angkatan = angkatan.trim();
      if (statusKrs?.trim()) params.statusKrs = statusKrs.trim();
      if (namaMahasiswa?.trim()) params.namaMahasiswa = namaMahasiswa.trim();
      if (hasPembimbing !== undefined) params.hasPembimbing = hasPembimbing;
      if (statusMahasiswa?.trim())
        params.statusMahasiswa = statusMahasiswa.trim();

      const response = await Api.get("/akademik/pembimbing-akademik/all", {
        params,
      });
      return response.data;
    },
    // Refetch ketika ada perubahan parameter
    refetchOnWindowFocus: false,
    // Only run query if periodeAkademik is provided
    enabled: !!periodeAkademik,
  });
}
