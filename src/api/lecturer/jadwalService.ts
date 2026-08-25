import { createJadwalService } from "../jadwalServiceFactory";
import { IApiResponseWithData } from "../../types/common.types";
import { IJadwalKuliah, IJadwalMingguan } from "../../types/mahasiswa.types";

interface GetJadwalParams {
    periodeId: string;
    hari: string;
}

const base = createJadwalService("/dosen/jadwal-akademik");

// Export all functions as a single service object
export const jadwalService = {
    getJadwalMingguan: (params: GetJadwalParams): Promise<IApiResponseWithData<IJadwalMingguan>> =>
        base.getJadwalMingguan(params),

    getJadwalHarian: (params: GetJadwalParams): Promise<IApiResponseWithData<IJadwalKuliah[]>> =>
        base.getJadwalHarian(params),
};
