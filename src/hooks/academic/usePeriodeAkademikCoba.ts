import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface PeriodeAkademik {
  id: string;
  tahun: string;
  namaPeriode: string;
  kodePeriode: string;
  status: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

export function getPeriodeAkdemikCoba() {
  return useQuery({
    queryKey: ["periode"],
    queryFn: async () => {
      const response = await Api.get("/akademik/periode-akademik");
      return response.data.data;
    },
  });
}
