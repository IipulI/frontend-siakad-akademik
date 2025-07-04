import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

// --- INTERFACES ---

export interface AcademicAdvisor {
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

export interface ApiResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalElements: number;
  };
}

interface AcademicAdvisorParams {
  page?: number;
  size?: number;
  periodeAkademik: string;
  programStudi?: string;
  angkatan?: string;
  statusKrs?: string;
  namaMahasiswa?: string;
  hasPembimbing?: boolean;
  statusMahasiswa?: string;
  sort?: string;
}

export interface ILecturer {
  id: string;
  nama: string;
  nidn: string;
}

export interface PeriodeAkademik {
  id: string;
  namaPeriode: string;
  status: "AKTIF" | "TIDAK_AKTIF";
}

// --- PAYLOAD INTERFACES ---

interface ApproveKrsPayload {
  mahasiswaIds: string[];
  periodeAkademikId: string;
}

interface CancelKrsPayload {
  mahasiswaIds: string[];
  periodeAkademikId: string;
}

interface AssignAdvisorPayload {
  periodeAkademikId: string;
  mahasiswaIds: string[];
  dosenId: string;
  noSk: string;
  tanggalSk: string; // format "YYYY-MM-DD"
}

// --- HOOKS ---

export function useGetAcademicAdvisor(params: AcademicAdvisorParams) {
  const { page = 1, size = 10, periodeAkademik, ...filters } = params;

  return useQuery<ApiResponse<AcademicAdvisor>>({
    queryKey: ["getAcademicAdvisor", page, size, periodeAkademik, filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams({ page: String(page), size: String(size), periodeAkademik, sort: filters.sort || "createdAt,desc" });
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
      const response = await Api.get(`/akademik/pembimbing-akademik/all?${queryParams.toString()}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!periodeAkademik,
  });
}

export function useApproveKrs() {
  return useMutation({
    mutationFn: async (payload: ApproveKrsPayload) => {
      return Api.post("/akademik/pembimbing-akademik/setuju", payload);
    },
    onSuccess: () => {
      alert("KRS berhasil disetujui!");
    },
    onError: (error) => {
      const errorMessage = (error as any).response?.data?.message || error.message;
      alert(`Gagal menyetujui KRS: ${errorMessage}`);
    },
  });
}

export function useCancelKrs() {
  return useMutation({
    mutationFn: (payload: CancelKrsPayload) => {
      return Api.post("/akademik/pembimbing-akademik/kembali", payload);
    },
    onSuccess: () => {
      alert("KRS berhasil dibatalkan/dikembalikan!");
    },
    onError: (error) => {
      const errorMessage = (error as any).response?.data?.message || error.message;
      alert(`Gagal membatalkan KRS: ${errorMessage}`);
    },
  });
}

export function useAssignAdvisor() {
  return useMutation({
    mutationFn: (payload: AssignAdvisorPayload) => {
      return Api.post("/akademik/pembimbing-akademik/add", payload);
    },
    onSuccess: () => {
      alert("Pembimbing akademik berhasil diatur!");
    },
    onError: (error) => {
      const errorMessage = (error as any).response?.data?.message || error.message;
      alert(`Gagal mengatur pembimbing: ${errorMessage}`);
    },
  });
}

export function useSearchLecturers(searchTerm: string) {
  return useQuery({
    queryKey: ["lecturers", searchTerm],
    queryFn: async () => {
      const response = await Api.get(`akademik/dosen?query=${searchTerm}`);
      return response.data.data as ILecturer[];
    },
    enabled: !!searchTerm,
  });
}

export function useGetAllPeriode() {
  return useQuery<PeriodeAkademik[]>({
    queryKey: ["getAllPeriode"],
    queryFn: async () => {
      const response = await Api.get("/akademik/periode-akademik");
      return response.data.data || [];
    },
    refetchOnWindowFocus: false,
  });
}

export function useGetActivePeriode() {
  const { data: allPeriods } = useGetAllPeriode();
  return {
    activePeriode: allPeriods?.find((p) => p.status === "AKTIF"),
    isLoadingPeriode: !allPeriods,
  };
}
