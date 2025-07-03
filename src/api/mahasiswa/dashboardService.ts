import { Api } from "../Index";
import { IApiResponseWithData } from "../../types/common.types";
import { IGrafikAkademik } from "../../types/mahasiswa.types";

const getGrafikAkademik = async (): Promise<IApiResponseWithData<IGrafikAkademik>> => {
    try {
        const response = await Api.get<IApiResponseWithData<IGrafikAkademik>>(
            "/mahasiswa/dashboard/grafik-akademik"
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching academic graph data:", error);
        throw error;
    }
};

const getInfoTagihan = async (): Promise<IApiResponseWithData<IInfoTagihan>> => {
    try {
        const response = await Api.get<IApiResponseWithData<IInfoTagihan>>(
            "/mahasiswa/dashboard/info-tagihan"
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching billing info:", error);
        throw error;
    }
};

export const dashboardService = {
    getGrafikAkademik,
    getInfoTagihan
};