import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export interface ObeHeaderKolom {
  id: string;
  label: string;
  bobot: number;
}

export interface ObeKelasNilaiRow {
  rincianKrsId: string;
  nim: string;
  nama: string;
  nilai?: Record<string, number>;
}

export function getKelasNilai(kelasId: string) {
  return useQuery({
    queryKey: ["obeKelasNilai", kelasId],
    queryFn: async () => {
      const response = await Api.get(`/akademik/dosen/kelas/${kelasId}/nilai`);
      const data = response.data.data || {};
      return {
        headerKolom: (data.headerKolom || []) as ObeHeaderKolom[],
        tabel: (data.tabel || []) as ObeKelasNilaiRow[],
      };
    },
    enabled: !!kelasId,
  });
}

export interface KomposisiSkor {
  komposisiId: string;
  skor: number;
}

export function useSubmitKelasNilai(kelasId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ krsId, nilai }: { krsId: string; nilai: KomposisiSkor[] }) => {
      const response = await Api.post(`/akademik/dosen/kelas/${kelasId}/nilai/${krsId}`, { nilai });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obeKelasNilai", kelasId] });
    },
  });
}
