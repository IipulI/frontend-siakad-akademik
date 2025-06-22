import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

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

export interface PaginationResponse {
  status: string;
  message: string;
  data: StudentBillData[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// GET - dengan pagination
export function useGetStudentBill(page: number = 1, size: number = 10) {
  return useQuery<PaginationResponse>({
    queryKey: ["getStudentBill", page, size],
    queryFn: async () => {
      const response = await Api.get(
        "/keuangan/invoice-mahasiswa/tagihan-mahasiswa",
        {
          params: {
            page,
            size,
          },
        }
      );
      return response.data;
    },
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
export function useMarkStudentBillAsPaid() {
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
