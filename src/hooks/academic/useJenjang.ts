import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface Jenjang {
  id: string;
  nama: string;
  jenjang: string;
}

export function getJenjang() {
  return useQuery({
    queryKey: ["jenjang"],
    queryFn: async () => {
      const response = await Api.get("/akademik/jenjang");
      console.log("🔍 Raw jenjang API data:", response.data.data);
      return response.data.data;
    },
  });
}
