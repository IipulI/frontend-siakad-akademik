// src/api/mahasiswa/jadwalService.ts

import { Api } from "../Index"; // Your main Axios instance
import { IApiResponseWithData } from "../../types/common.types";
import { IJadwalKuliah, IJadwalMingguan } from "../../types/mahasiswa.types";

// Interface for the service function parameters
interface GetJadwalParams {
    namaPeriode: string;
    hari: string;
}

/**
 * Fetches the weekly schedule for a student for a specific period from the new endpoint.
 * GET /mahasiswa/jadwal-akademik/minggu?namaPeriode=...
 */
const getJadwalMingguan = async (
    params: GetJadwalParams
): Promise<IApiResponseWithData<IJadwalMingguan>> => {
    try {
        const response = await Api.get<IApiResponseWithData<IJadwalMingguan>>(
            "/mahasiswa/jadwal-akademik/minggu",
            {
                params: {
                    namaPeriode: params.namaPeriode,
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

/**
 * Fetches the schedule for a single day.
 * GET /mahasiswa/jadwal?periodeAkademik=...&hari=...
 */
const getJadwalHarian = async (params: {
    namaPeriode: string;
    hari: string;
}): Promise<IApiResponseWithData<IJadwalKuliah[]>> => {
    try {
        const response = await Api.get<IApiResponseWithData<IJadwalKuliah[]>>(
            "/mahasiswa/jadwal",
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