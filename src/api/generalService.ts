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
        const response = await Api.get<IApiResponseWithData<IAcademicActivePeriod>>(
            "/periode-akademik/active-status"
        );
        return response.data;
    },
};