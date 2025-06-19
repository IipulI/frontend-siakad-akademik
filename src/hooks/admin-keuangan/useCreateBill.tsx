import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface InvoiceDataProps {
  siakMahasiswaIds: string[];
  tanggalTenggat: string;
  tahap: string;
  komponen: {
    komponenId: string;
  }[];
}

export interface StudentDataProps {
  id: string;
  npm: string;
  nama: string;
  namaFakultas: string;
  namaProgramStudi: string;
  semester: string;
  angkatan: string;
}

export interface DataKomponenTagihanProps {
  id: string;
  kodeKomponen: string;
  nama: string;
  nominal: number;
  selected?: boolean;
}

export interface FormDataProps {
  tanggalTenggat: string;
  tahap: string;
}

// get
export function useCreateBill() {
  return useQuery({
    queryKey: ["getCreateBill"],
    queryFn: async () => {
      const response = await Api.get("/keuangan/invoice-mahasiswa/mahasiswa");
      return response.data.data;
    },
  });
}

// get
export function useGetComponentBill() {
  return useQuery({
    queryKey: ["getComponentBill"],
    queryFn: async () => {
      const response = await Api.get("/keuangan/invoice-komponen-mahasiswa");
      return response.data.data;
    },
  });
}

// post
export function useCreateInvoiceData() {
  return useMutation({
    mutationKey: ["createInvoiceData"],
    mutationFn: async (newInvoiceData: InvoiceDataProps) => {
      const response = await Api.post(
        "/keuangan/invoice-mahasiswa",
        newInvoiceData
      );
      return response.data.data;
    },
  });
}
