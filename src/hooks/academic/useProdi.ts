// hooks/academic/useProdi.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ProgramStudiData {
  id: string;
  namaProgramStudi: string;
  jenjang: string;
}

export function getProdi(options?: Omit<UseQueryOptions<ProgramStudiData[]>, "queryKey" | "queryFn">) {
  return useQuery<ProgramStudiData[]>({
    queryKey: ["prodiData"],
    queryFn: async () => {
      const response = await Api.get("/akademik/program-studi");
      return response.data.data;
    },
    ...options,
  });
}
