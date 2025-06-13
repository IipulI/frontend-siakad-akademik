import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";

export default function getProgramStudies() {
  return useQuery({
    queryKey: ["programStudies"],
    queryFn: async () => {
      const response = await Api.get("/akademik/program-studi");
      return response.data.data;
    },
  });
}
