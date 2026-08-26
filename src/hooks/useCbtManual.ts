import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../api/Index";

// ---------- Jalur D (CBT) -- input manual sementara ----------
// CBT (soal & koreksi) sedang error buat ditest, jadi dosen bisa kirim
// breakdown Sub-CPMK per komponen langsung dari NL-SIAK lewat form ini,
// lewat endpoint yang sama persis yang dipakai integrasi CBT beneran
// (POST /akademik/cbt/komponen/:rencanaEvaluasiId/nilai). Backend otomatis
// hitung ulang capaian CPMK + nilai akhir MK dari breakdown ini
// (hitungDanOverrideNilaiCpmkDariKomponen + refreshNilaiAkhirJalurD) --
// TIDAK perlu panggil endpoint nilai-akhir terpisah.
//
// Model yang dipakai di sini: "1 unit = 1 CPMK" (skorMaksimal = bobot resmi
// CPMK itu di rencana evaluasi), paling sederhana & selalu valid terhadap
// validasi bobot di backend -- CBT beneran boleh kirim banyak unit per CPMK
// (per soal), tapi itu di luar cakupan form manual ini.

export interface PemetaanCpmkUnit {
  cpmkId: string;
  bobotPoin: number;
}

export interface BreakdownUnit {
  skorDiperoleh: number;
  skorMaksimal: number;
  pemetaanCpmk: PemetaanCpmkUnit[];
}

export interface SimpanNilaiKomponenCbtPayload {
  rencanaEvaluasiId: string;
  krsId: string;
  breakdown: BreakdownUnit[];
}

export function useSimpanNilaiKomponenCbt(kelasId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ rencanaEvaluasiId, krsId, breakdown }: SimpanNilaiKomponenCbtPayload) => {
      const response = await Api.post(`/akademik/cbt/komponen/${rencanaEvaluasiId}/nilai`, {
        daftarNilai: [{ krsId, breakdown }],
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nilaiKelas", kelasId] });
      queryClient.invalidateQueries({ queryKey: ["capaianCpmk", kelasId] });
      queryClient.invalidateQueries({ queryKey: ["capaianCpl", kelasId] });
    },
  });
}
