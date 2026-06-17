import { Api } from "./Index";
import {
    IAcademicPeriod,
    IAcademicActivePeriod,
    IApiResponseWithData
} from "../types/common.types";

export const generalService = {
    /**
     * Fetches available academic periods for dropdowns.
     * Endpoint: /periode-akademik/dropdown
     */
    getAcademicPeriods: async (): Promise<IAcademicPeriod[]> => {
        const response = await Api.get("/periode-akademik/dropdown");
        return response.data.data;
    }, 

    /**
     * Fetches the currently active academic period.
     * Endpoint: /periode-akademik/active-status
     */
    getActivePeriod: async (): Promise<IApiResponseWithData<IAcademicActivePeriod>> => {
        try {
            const response = await Api.get<IApiResponseWithData<IAcademicActivePeriod>>(
                "/periode-akademik/active-status"
            );
            return response.data;
        } catch (error: any) {
            // Fallback if active-status endpoint is not available (404)
            if (error.response?.status === 404) {
                console.warn("active-status endpoint not found, falling back to dropdown endpoint.");
                const dropdownResponse = await Api.get<any>("/periode-akademik/dropdown");
                const list = dropdownResponse.data.data || [];
                const active = list.find(
                    (item: any) =>
                        item.status === "Aktif" ||
                        item.status === "ACTIVE"
                );

                if (active) {
                    return {
                        status: 200,
                        message: "Success (Fallback)",
                        data: {
                            id: active.id,
                            tahun: active.tanggal_mulai ? active.tanggal_mulai.split("-")[0] : "",
                            namaPeriode: active.nama || active.namaPeriode || "",
                            kodePeriode: active.kode || active.kodePeriode || "",
                            status: "ACTIVE",
                            tanggalMulai: active.tanggal_mulai || "",
                            tanggalSelesai: active.tanggal_selesai || "",
                        }
                    };
                }
            }
            throw error;
        }
    },
};