import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index.tsx";

export interface ICplData {
  id: string;
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;
  programStudi?: string;
  tahunKurikulum?: string;
  kodeCpl: string;
  deskripsiCpl: string;
  kategoriCpl: string;
  profilLulusanIds: string[];
}

export interface ICplPayload {
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;
  kodeCpl: string;
  deskripsiCpl: string;
  kategoriCpl: string;
  profilLulusanIds: string[];
}

interface ICplParams {
  page: number;
  size: number;
}

export function getCpl(params: ICplParams) {
  return useQuery({
    queryKey: ["cpl", params],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await Api.get("/akademik/capaian-pembelajaran-lulusan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
  });
}
