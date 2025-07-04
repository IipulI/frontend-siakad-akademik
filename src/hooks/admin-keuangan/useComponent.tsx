// hooks/useFetchComponentBill.ts
import { Api } from "../../api/Index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ComponentBillData {
  id: string;
  kodeKomponen: string;
  nama: string;
  nominal: number;
}

export interface CreateComponentBillData {
  kodeKomponen: string;
  nama: string;
  nominal: number;
}

export interface PaginationResponse {
  status: string;
  message: string;
  data: ComponentBillData[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// GET - dengan pagination
export function useGetComponentBill(
  page: number = 1,
  size: number = 10,
  keyword: string = ""
) {
  return useQuery<PaginationResponse>({
    queryKey: ["getComponentBill", page, size, keyword],
    queryFn: async () => {
      // Buat object params dan hanya tambahkan parameter yang tidak kosong
      const params: any = {
        page,
        size,
      };

      // Tambahkan parameter filter hanya jika ada nilainya
      if (keyword.trim()) params.keyword = keyword.trim();

      const response = await Api.get("/keuangan/invoice-komponen-mahasiswa", {
        params
      });
      return response.data;
    },
  });
}

// POST
export function useCreateComponentBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createComponentBill"],
    mutationFn: async (newClassData: CreateComponentBillData) => {
      const response = await Api.post(
        "/keuangan/invoice-komponen-mahasiswa",
        newClassData
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate pagination queries
      queryClient.invalidateQueries({ queryKey: ["getComponentBill"] });
    },
  });
}

// PUT
export function useEditComponentBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["editComponentBill"],
    mutationFn: async (data: ComponentBillData) => {
      const response = await Api.put(
        `/keuangan/invoice-komponen-mahasiswa/${data.id}`,
        {
          kodeKomponen: data.kodeKomponen,
          nama: data.nama,
          nominal: data.nominal,
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate pagination queries
      queryClient.invalidateQueries({ queryKey: ["getComponentBill"] });
    },
  });
}

// DELETE
export function useDeleteComponentBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await Api.delete(`/keuangan/invoice-komponen-mahasiswa/${id}`);
    },
    onSuccess: () => {
      // Invalidate pagination queries
      queryClient.invalidateQueries({ queryKey: ["getComponentBill"] });
    },
  });
}
