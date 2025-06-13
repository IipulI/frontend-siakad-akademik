import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";

export default function getAcademicPeriods() {
  return useQuery({
    queryKey: ["academicPeriods"],
    queryFn: async () => {
      const response = await Api.get("/akademik/periode-akademik/dropdown");
      return response.data.data;
    },
  });
}
