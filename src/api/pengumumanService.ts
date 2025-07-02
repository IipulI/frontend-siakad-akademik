import { Api } from "./Index"; // Your main configured Axios instance
import { IPaginatedResponse } from "../types/common.types"; // Your pagination interface
import { IPengumuman } from "../types/common.types"; // Your announcement interface

// Interface for the function's parameters for type safety
interface PengumumanParams {
    page?: number;
    size?: number;
    sort?: string;
}

/**
 * Fetches a paginated list of announcements.
 * GET /mahasiswa/pengumuman
 * @param params - Optional parameters for pagination and sorting (e.g., { page: 1, size: 5 })
 * @returns A promise that resolves to a paginated response of announcements.
 */
const getPengumuman = async (
    params: PengumumanParams
): Promise<IPaginatedResponse<IPengumuman>> => {
    try {
        // The backend response is expected to directly match your IPaginatedResponse interface
        const response = await Api.get<IPaginatedResponse<IPengumuman>>(
            "/mahasiswa/pengumuman",
            { params }
        );
        return response.data;
    } catch (error) {
        // The error will be handled by React Query's error state
        console.error("Error fetching announcements:", error);
        throw error;
    }
};

// Export all functions related to announcements as a single service object
export const pengumumanService = {
    getPengumuman,
};