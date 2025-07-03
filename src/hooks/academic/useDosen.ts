import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export function getDosen() {
  return useQuery({
    queryKey: ["dosen"],
    queryFn: async () => {
      const response = await Api.get("/akademik/dosen");
      console.log("🔍 Raw dosen API data:", response.data.data);
      return response.data.data;
    },
  });
}
