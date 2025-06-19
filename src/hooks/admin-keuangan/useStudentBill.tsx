import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

// get
export function useGetStudentBill() {
  return useQuery({
    queryKey: ["getStudentBill"],
    queryFn: async () => {
      const response = await Api.get(
        "/keuangan/invoice-mahasiswa/tagihan-mahasiswa"
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
