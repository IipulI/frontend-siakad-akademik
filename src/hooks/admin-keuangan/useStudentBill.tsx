import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface StudentBillData {
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

export function useGetStudentBillDetail(id: string) {
  return useQuery<StudentBillData>({
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
