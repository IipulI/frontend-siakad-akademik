import { useQuery } from "@tanstack/react-query";
import { jadwalService } from "../../api/mahasiswa/jadwalService";
import { IJadwalMingguan, IJadwalKuliah } from "../../types/mahasiswa.types";

// Update params to be a discriminated union for type safety
type UseJadwalParams =
    | { type: 'weekly'; namaPeriode: string; }
    | { type: 'daily'; namaPeriode: string; hari: string; };

/**
 * Custom hook to fetch schedule data for a student.
 * Handles both weekly and daily schedule fetching.
 */
export const useJadwal = (params: UseJadwalParams) => {
    const isWeekly = params.type === 'weekly';
    const isDaily = params.type === 'daily';

    // The query key is now dynamic based on the request type
    const queryKey = isWeekly
        ? ["jadwal", params.type, params.namaPeriode]
        : ["jadwal", params.type, params.namaPeriode, (params as any).hari];

    return useQuery<IJadwalMingguan | IJadwalKuliah[], Error>({
        queryKey,
        queryFn: async () => {
            switch (params.type) {
                case 'weekly':
                    const weeklyResponse = await jadwalService.getJadwalMingguan({
                        namaPeriode: params.namaPeriode,
                        hari: null
                    });
                    return weeklyResponse.data;

                case 'daily':
                    const dailyResponse = await jadwalService.getJadwalHarian({
                        namaPeriode: params.namaPeriode,
                        hari: params.hari,
                    });
                    return dailyResponse.data;
            }
        },
        // Enable the query only if all required parameters are present
        enabled:
            (isWeekly && !!params.namaPeriode) ||
            (isDaily && !!params.namaPeriode && !!params.hari)
    });
};