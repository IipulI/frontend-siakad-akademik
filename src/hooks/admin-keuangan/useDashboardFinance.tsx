import { Api } from "../../api/Index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface EditStudentBillData {
  id: string;
  tanggalTenggat: string;
}

// get
export function useGetAllbill() {
  return useQuery({
    queryKey: ["getAllBill"],
    queryFn: async () => {
      const response = await Api.get(
        "/keuangan/invoice-mahasiswa/tagihan-mahasiswa/ringkasan"
      );
      return response.data.data;
    },
  });
}

// get
export function useFacultyBill() {
  return useQuery({
    queryKey: ["getFacultyBill"],
    queryFn: async () => {
      const response = await Api.get(
        "/keuangan/invoice-mahasiswa/tagihan-fakultas"
      );
      return response.data.data;
    },
  });
}

// get
export function useLastTransaction() {
  return useQuery({
    queryKey: ["getLastTransaction"],
    queryFn: async () => {
      const response = await Api.get(
        "/keuangan/invoice-mahasiswa/tagihan-lunas"
      );
      return response.data.data;
    },
  });
}

// put
export function useEditStudentBill() {
  return useMutation({
    mutationKey: ["editTangggalTenggat"],
    mutationFn: async (data: EditStudentBillData) => {
      const response = await Api.put(
        `/keuangan/invoice-mahasiswa/${data.id}/tanggal-tenggat`,
        {
          tanggalTenggat: data.tanggalTenggat,
        }
      );
      return response.data.data;
    },
  });
}
