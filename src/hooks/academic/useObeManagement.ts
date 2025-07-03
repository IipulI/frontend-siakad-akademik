import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ObeData {
  id: string;
  kodeProgramStudi: string;
  programStudi: string;
  jenjang: {
    id: string;
    nama: string;
    jenjang: string;
  };
  statusPl: boolean;
  statusCpl: boolean;
  statusPlCpl: boolean;
  statusCpmk: boolean;
}

export function getObe() {
  return useQuery({
    queryKey: ["obe"],
    queryFn: async () => {
      const response = await Api.get("/akademik/manajemen-obe");
      console.log("🔍 Raw OBE API data:", response.data.data);
      return response.data.data;
    },
  });
}

export function getObeById(id: string) {
  return useQuery({
    queryKey: ["obeById", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.get(`/akademik/manajemen-obe/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    },
    enabled: !!id,
  });
}
