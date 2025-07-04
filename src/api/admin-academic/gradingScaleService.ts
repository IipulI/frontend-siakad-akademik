// src/api/admin-academic/gradingScaleService.ts
import { Api } from '../Index'; // Your Axios instance
import {
    IGradingScale,
    IGradingScalePayload,
    IPaginatedResponse, // Indicates a paginated GET response
    IApiResponseSuccess,
} from '../../types/models';

/**
 * Interface for parameters when fetching Grading Scales.
 * Matches your GET endpoint's query parameters for filtering and pagination.
 */
interface GetGradingScalesParams {
    tahunAjaran?: string;   // Filter by Academic Year Name (from frontend dropdown label)
    programStudi?: string;  // Filter by Program Studi Name (from frontend dropdown label)
    page?: number;          // Current page number
    size?: number;          // Items per page
    sort?: string;          // Sorting criteria, e.g., "createdAt,desc"
}

export const gradingScaleService = {
    /**
     * Fetches a paginated list of Grading Scales from the API.
     * GET /akademik/skala-penilaian
     */
    getGradingScales: async (
        params: GetGradingScalesParams = {}
    ): Promise<IPaginatedResponse<IGradingScale>> => {
        try {
            const response = await Api.get<IPaginatedResponse<IGradingScale>>(
                '/akademik/skala-penilaian',
                {
                    params: {
                        tahunAjaran: params.tahunAjaran || '',   // Send empty string if no filter selected
                        programStudi: params.programStudi || '', // Send empty string if no filter selected
                        page: params.page || 1,                  // Default to page 1
                        size: params.size || 10,                 // Default to 10 items per page
                        sort: params.sort || 'createdAt,desc',   // Default sort order
                    },
                }
            );
            return response.data; // The API response includes data and pagination directly
        } catch (error) {
            console.error('Error fetching Grading Scales:', error);
            throw error; // Re-throw for consistent error handling in hooks/components
        }
    },

    /**
     * Creates a new Grading Scale rule.
     * POST /akademik/skala-penilaian
     */
    createGradingScale: async (
        payload: IGradingScalePayload
    ): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.post<IApiResponseSuccess>(
                '/akademik/skala-penilaian',
                payload
            );
            return response.data;
        } catch (error) {
            console.error('Error creating Grading Scale:', error);
            throw error;
        }
    },

    /**
     * Updates an existing Grading Scale rule.
     * PUT /akademik/skala-penilaian/{id}
     */
    updateGradingScale: async (
        id: string,
        payload: IGradingScalePayload
    ): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.put<IApiResponseSuccess>(
                `/akademik/skala-penilaian/${id}`,
                payload
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating Grading Scale with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Deletes a Grading Scale rule.
     * DELETE /akademik/skala-penilaian/{id}
     */
    deleteGradingScale: async (id: string): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.delete<IApiResponseSuccess>(
                `/akademik/skala-penilaian/${id}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error deleting Grading Scale with ID ${id}:`, error);
            throw error;
        }
    },
};