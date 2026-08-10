// src/api/mahasiswa/jadwalService.ts
import { createJadwalService } from "../jadwalServiceFactory";
import { IApiResponseWithData } from "../../types/common.types";
import { IJadwalKuliah, IJadwalMingguan } from "../../types/mahasiswa.types";

interface GetJadwalParams {
    namaPeriode: string;
    hari: string;
}

const base = createJadwalService("/mahasiswa/jadwal-akademik");

// Export all functions as a single service object
export const jadwalService = {
    /**
     * Fetches the weekly schedule for a student for a specific period.
     * GET /mahasiswa/jadwal-akademik/minggu?namaPeriode=...
     */
    getJadwalMingguan: (params: GetJadwalParams): Promise<IApiResponseWithData<IJadwalMingguan>> =>
        base.getJadwalMingguan(params),

    /**
     * Fetches the schedule for a single day.
     * GET /mahasiswa/jadwal-akademik/harian?namaPeriode=...&hari=...
     */
    getJadwalHarian: (params: GetJadwalParams): Promise<IApiResponseWithData<IJadwalKuliah[]>> =>
        base.getJadwalHarian(params),
};
