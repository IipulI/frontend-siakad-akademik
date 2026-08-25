import { Api } from "./Index";
import { IApiResponseWithData } from "../types/common.types";
import { IJadwalKuliah, IJadwalMingguan } from "../types/mahasiswa.types";

/**
 * Shared implementation behind the per-role jadwal services (mahasiswa/lecturer),
 * which only differ by base path and the query param key used to pass the period.
 */
export function createJadwalService(basePath: string) {
    const getJadwalMingguan = async (
        params: Record<string, string>
    ): Promise<IApiResponseWithData<IJadwalMingguan>> => {
        try {
            const response = await Api.get<IApiResponseWithData<IJadwalMingguan>>(
                `${basePath}/minggu`,
                { params }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching weekly schedule:", error);
            throw error;
        }
    };

    const getJadwalHarian = async (
        params: Record<string, string>
    ): Promise<IApiResponseWithData<IJadwalKuliah[]>> => {
        try {
            const response = await Api.get<IApiResponseWithData<IJadwalKuliah[]>>(
                `${basePath}/harian`,
                { params }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching daily schedule:", error);
            throw error;
        }
    };

    return { getJadwalMingguan, getJadwalHarian };
}
