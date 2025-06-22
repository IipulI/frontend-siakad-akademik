import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface InvoiceData {
  siakMahasiswaIds: string[];
  tanggalTenggat: string;
  tahap: string;
  komponen: {
    komponenId: string;
  }[];
}

export interface StudentData {
  id: string;
  npm: string;
  nama: string;
  namaFakultas: string;
  namaProgramStudi: string;
  semester: string;
  angkatan: string;
}

export interface DataKomponenTagihan {
  id: string;
  kodeKomponen: string;
  nama: string;
  nominal: number;
  selected?: boolean;
}

export interface FormData {
  tanggalTenggat: string;
  tahap: string;
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
export function useCreateBill(page: number = 1, size: number = 10) {
  return useQuery<PaginationResponse>({
    queryKey: ["getCreateBill", page, size],
    queryFn: async () => {
      const response = await Api.get("/keuangan/invoice-mahasiswa/mahasiswa", {
        params: {
          page,
          size,
        },
      });
      return response.data;
    },
  });
}

// get
export function useGetComponentBill() {
  return useQuery({
    queryKey: ["getComponentBill"],
    queryFn: async () => {
      const response = await Api.get("/keuangan/invoice-komponen-mahasiswa", {
        params: {
          page: 1,
          size: 999999,
        },
      });
      return response.data.data;
    },
  });
}

// post
export function useCreateInvoiceData() {
  return useMutation({
    mutationKey: ["createInvoiceData"],
    mutationFn: async (newInvoiceData: InvoiceData) => {
      const response = await Api.post(
        "/keuangan/invoice-mahasiswa",
        newInvoiceData
      );
      return response.data.data;
    },
  });
}
