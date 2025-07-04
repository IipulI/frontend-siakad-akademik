import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface PeriodeAkademik {
  id: string;
  siakTahunAjaranId: "3fa85f64-5717-4562-b3fc-2c963f66afa6";
  namaPeriode: string;
  kodePeriode: string;
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
