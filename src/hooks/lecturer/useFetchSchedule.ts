import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";
import { IJadwalKuliah, IJadwalMingguan } from "../../types/mahasiswa.types";
import { jadwalService } from "../../api/lecturer/jadwalService";

interface UseJadwalParams {
    type: 'weekly' | 'daily';
    periodeId: string;
    hari?: string;
}

export const useScheduleList = (periodeAkademik: string) =>
    useQuery({
      queryKey: ['dosen/jadwal', periodeAkademik],
        queryFn: async () => {
            const res = await Api.get(`/dosen/jadwal-akademik/`)
            return res.data
        },
        enabled: !!periodeAkademik
})

export const useJadwalDosen = (params: UseJadwalParams) => {
    const isWeekly = params.type === 'weekly';
    const isDaily = params.type === 'daily';

    // The query key is now dynamic based on the request type
    const queryKey = isWeekly
        ? ["jadwal", params.type, params.periodeId]
        : ["jadwal", params.type, params.periodeId, (params as any).hari];

    return useQuery<IJadwalMingguan | IJadwalKuliah[], Error>({
        queryKey,
        queryFn: async () => {
            switch (params.type) {
                case 'weekly':
                    const weeklyResponse = await jadwalService.getJadwalMingguan({
                        periodeId: params.periodeId,
                        hari: null
                    });
                    return weeklyResponse.data;

                case 'daily':
                    const dailyResponse = await jadwalService.getJadwalHarian({
                        periodeId: params.periodeId,
                        hari: params.hari,
                    });
                    return dailyResponse.data;
            }
        },
        // Enable the query only if all required parameters are present
        enabled:
            (isWeekly && !!params.periodeId) ||
            (isDaily && !!params.periodeId && !!params.hari)
    });
};