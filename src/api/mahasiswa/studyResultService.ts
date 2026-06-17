import { Api } from "../Index";
import { IKhsData } from "../../types/mahasiswa.types";

export const studyResultService = {
    /**
     * Fetches the study results (KHS) for a specific period.
     * Now handles 404 "Not Found" errors gracefully.
     */
    getStudyResultsByPeriod: async (
        periodeId: string
    ): Promise<IKhsData | null> => {
        try {
            const response = await Api.get("/mahasiswa/hasil-studi", {
                params: {
                    periodeId: periodeId
                },
            });
            console.log(response.data.data);
            return response.data.data;
        } catch (error) {
            // If the error is a 404, return null to indicate no data was found
            if (error.response && error.response.status === 404) {
                return null;
            }
            // For all other errors, throw them so React Query can handle them
            throw error;
        }
    },
};