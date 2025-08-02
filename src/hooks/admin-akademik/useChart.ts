import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export function getAKMProdi() {
  return useQuery({
    queryKey: ["prodiChart"],
    queryFn: async () => {
      const response = await Api.get("/akademik/dashboard/akm-prodi");
      return response.data.data;
    },
  });
}
