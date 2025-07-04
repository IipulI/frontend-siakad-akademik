import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ProgramStudiData {
  id: string;
  namaProgramStudi: string;
  jenjang: string;
}

export function getProdi() {
  return useQuery({
    queryKey: ["prodiData"],
    queryFn: async () => {
      const response = await Api.get("/akademik/program-studi");
      return response.data.data;
    },
  });
}
