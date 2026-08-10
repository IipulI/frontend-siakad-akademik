import { useQuery } from "@tanstack/react-query";
import { programStudiService } from "../../api/admin-academic/programStudiService";
import { IProgramStudi } from "../../types/models";

export function getProdi() {
  return useQuery<IProgramStudi[], Error>({
    queryKey: ["prodiData"],
    queryFn: programStudiService.getProgramStudi,
    staleTime: Infinity,
  });
}
