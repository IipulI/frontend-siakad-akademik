// hooks/useFetchComponentBill.ts
import { useEffect, useState } from "react";
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
export function useCreateComponentBill() {
  return useMutation({
    mutationKey: ["createComponentBill"],
    mutationFn: async (newClassData: CreateComponentBillData) => {
      const response = await Api.post(
        "/keuangan/invoice-komponen-mahasiswa",
        newClassData
      );
      return response.data.data;
    },
  });
}

// put
export function useEditComponentBill() {
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
  });
}

// delete
export function useDeleteComponentBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await Api.delete(`/keuangan/invoice-komponen-mahasiswa/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getComponentBill"] });
    },
  });
}
