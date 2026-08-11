import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";
import { IPaginatedResponse } from "../../types/common.types";

export interface StudentBillDataDetail {
  kodeInvoice: string;
  periodeAkademik: string;
  metodeBayar: string;
  tanggalBayar: string;
  totalBayar: number;
  npm: string;
  nama: string;
  programStudiResDto: {
    id: string;
    namaProgramStudi: string;
    jenjang: {
      id: string;
      nama: string;
      jenjang: string;
    };
  };
  tagihanKomponenDtos: {
    kodeKomponen: string;
    namaKomponen: string;
    tagihan: number;
    tanggalTenggat: string;
  }[];
}

export interface StudentBillData {
  id: string;
  kodeTagihan: string;
  tanggal: string;
  jenisTagihan:string;
  bayar:number;
  npm: string;
  nama: string;
  nominal: number;
  tanggalTenggat: string;
  tanggalBayar: string;
  lunas: boolean;
}

export type PaginationResponse = IPaginatedResponse<StudentBillData>;

// GET - dengan pagination dan filter
export function useGetStudentBill(
  page: number = 1,
  size: number = 10,
  keyword: string = "",
  semester: string = "",
  angkatan: string = "",
  fakultas: string = "",
  programStudi: string = "",
  periodeAkademik: string = "",
) {
  return useQuery<PaginationResponse>({
    queryKey: [
      "getStudentBill",
      page,
      size,
      keyword,
      semester,
      angkatan,
      fakultas,
      programStudi,
      periodeAkademik,
    ],
    queryFn: async () => {
      // Buat object params dan hanya tambahkan parameter yang tidak kosong
      const params: any = {
        page,
        size,
      };

      // Tambahkan parameter filter hanya jika ada nilainya
      if (keyword.trim()) params.keyword = keyword.trim();
      if (semester.trim()) params.semester = semester.trim();
      if (angkatan.trim()) params.angkatan = angkatan.trim();
      if (fakultas.trim()) params.fakultas = fakultas.trim();
      if (programStudi.trim()) params.programStudi = programStudi.trim();
      if (periodeAkademik.trim())
        params.periodeAkademik = periodeAkademik.trim();

      const response = await Api.get(
        "/keuangan/invoice-mahasiswa/tagihan-mahasiswa",
        {
          params,
        }
      );
      return response.data;
    },
    // Refetch ketika ada perubahan parameter
    refetchOnWindowFocus: false,
  });
}

export function useGetStudentBillDetail(id: string) {
  return useQuery<StudentBillDataDetail>({
    queryKey: ["getStudentBillDetail", id], // Sertakan id dalam queryKey
    queryFn: async () => {
      const response = await Api.get(
        `/keuangan/invoice-mahasiswa/tagihan-mahasiswa/${id}`
      );
      return response.data.data;
    },
  });
}

// put
export function useTandaiLunas() {
  return useMutation({
    mutationKey: ["markStudentBillAsPaid"],
    mutationFn: async (ids: string[]) => {
      const response = await Api.put(
        "/keuangan/invoice-mahasiswa/tandai-lunas",
        {
          invoiceMahasiswaIds: ids,
        }
      );
      return response.data;
    },
  });
}

// delete
export function useDeleteStudentBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await Api.delete(`/keuangan/invoice-mahasiswa/tagihan-mahasiswa/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStudentBill"] });
    },
  });
}
