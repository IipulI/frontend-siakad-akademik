import { Api } from "./Index";
import { IApiResponseWithData, IPaginatedResponse, IPengumuman } from "../types/common.types";

interface PengumumanParams {
    page?: number;
    size?: number;
    sort?: string;
    keyword?: string;
}

/**
 * Shared implementation behind the per-role pengumuman services (mahasiswa/akademik),
 * which only differ by base path.
 */
export function createPengumumanService(basePath: string) {
    const getPengumuman = async (
        params: PengumumanParams
    ): Promise<IPaginatedResponse<IPengumuman>> => {
        try {
            const response = await Api.get<IPaginatedResponse<IPengumuman>>(basePath, { params });
            return response.data;
        } catch (error) {
            console.error("Error fetching announcements:", error);
            throw error;
        }
    };

    const getPengumumanById = async (id: string): Promise<IApiResponseWithData<IPengumuman>> => {
        try {
            const response = await Api.get<IApiResponseWithData<IPengumuman>>(`${basePath}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching announcement with id ${id}:`, error);
            throw error;
        }
    };

    const getPengumumanBanner = async (id: string): Promise<Blob> => {
        try {
            const response = await Api.get<Blob>(`${basePath}/${id}/banner`, {
                responseType: "blob",
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching banner for announcement id ${id}:`, error);
            throw error;
        }
    };

    return { getPengumuman, getPengumumanById, getPengumumanBanner };
}
