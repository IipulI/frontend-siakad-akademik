// src/api/admin-academic/levelService.ts
import { Api } from '../Index'; // Your Axios instance
import {
    ILevel,
    ILevelPayload,
    IApiResponseSuccess,
} from '../../types/models';

export const levelService = {
    /**
     * Fetches all educational levels from the API.
     * GET /akademik/jenjang
     * Note: This endpoint does not appear to be paginated based on your provided response.
     */
    getLevels: async (): Promise<ILevel[]> => {
        try {
            // Your API response is { status, message, data: [] }, so we need to extract 'data'
            const response = await Api.get<{ data: ILevel[], status: string, message: string }>('/akademik/jenjang');
            return response.data.data; // Extract the actual data array
        } catch (error) {
            console.error('Error fetching levels:', error);
            throw error; // Re-throw the error for the calling component to handle
        }
    },

    /**
     * Creates a new educational level.
     * POST /akademik/jenjang
     */
    createLevel: async (
        payload: ILevelPayload
    ): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.post<IApiResponseSuccess>(
                '/akademik/jenjang',
                payload
            );
            return response.data;
        } catch (error) {
            console.error('Error creating level:', error);
            throw error;
        }
    },

    /**
     * Updates an existing educational level.
     * PUT /akademik/jenjang/{id}
     */
    updateLevel: async (
        id: string,
        payload: ILevelPayload
    ): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.put<IApiResponseSuccess>(
                `/akademik/jenjang/${id}`,
                payload
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating level with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Deletes an educational level.
     * DELETE /akademik/jenjang/{id}
     */
    deleteLevel: async (id: string): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.delete<IApiResponseSuccess>(
                `/akademik/jenjang/${id}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error deleting level with ID ${id}:`, error);
            throw error;
        }
    },
};