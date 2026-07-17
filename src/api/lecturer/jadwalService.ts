import { Api } from "../Index"; // Your main Axios instance
import { IApiResponseWithData } from "../../types/common.types";
import { IJadwalKuliah, IJadwalMingguan } from "../../types/mahasiswa.types";

interface GetJadwalParams {
    periodeId: string;
    hari: string;
}

const getJadwalMingguan = async (
    params: GetJadwalParams
): Promise<IApiResponseWithData<IJadwalMingguan>> => {
    try {
        const response = await Api.get<IApiResponseWithData<IJadwalMingguan>>(
            "/dosen/jadwal-akademik/minggu",
            {
                params: {
                    periodeId: params.periodeId,
                },
            }
        );
        return response.data;
    } catch (error) {
        // The error will be handled by React Query's error state
        console.error("Error fetching weekly schedule:", error);
        throw error;
    }
};

const getJadwalHarian = async (params: {
    periodeId: string;
    hari: string;
}): Promise<IApiResponseWithData<IJadwalKuliah[]>> => {
    try {
        const response = await Api.get<IApiResponseWithData<IJadwalKuliah[]>>(
            "/dosen/jadwal-akademik/harian",
            { params }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching daily schedule:", error);
        throw error;
    }
};

// Export all functions as a single service object
export const jadwalService = {
    getJadwalMingguan,
    getJadwalHarian,
};