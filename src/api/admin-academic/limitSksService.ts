// src/api/admin-academic/limitSksService.ts
import { Api } from '../Index';
import {
    ILimitSKS,
    ILimitSKSPayload,
    IApiResponseSuccess, // IPaginatedResponse is no longer needed here
} from '../../types/models';

// Remove GetLimitSKSParams as it's no longer paginated
// interface GetLimitSKSParams { ... }

export const limitSksService = {
    /**
     * Fetches all SKS Limits from the API.
     * GET /akademik/batas-sks
     * This endpoint is NOT paginated.
     */
    getLimitSKS: async (): Promise<ILimitSKS[]> => { // No params, returns ILimitSKS[] directly
        try {
            // Your API response is { status, message, data: [] }, so we need to extract 'data'
            const response = await Api.get<{ data: ILimitSKS[], status: string, message: string }>('/akademik/batas-sks');
            return response.data.data; // Extract the actual data array
        } catch (error) {
            console.error('Error fetching SKS Limits:', error);
            throw error;
        }
    },

    /**
     * Creates a new SKS Limit rule.
     * POST /akademik/batas-sks
     */
    createLimitSKS: async (
        payload: ILimitSKSPayload
    ): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.post<IApiResponseSuccess>(
                '/akademik/batas-sks',
                payload
            );
            return response.data;
        } catch (error) {
            console.error('Error creating SKS Limit:', error);
            throw error;
        }
    },

    /**
     * Updates an existing SKS Limit rule.
     * PUT /akademik/batas-sks/{id}
     */
    updateLimitSKS: async (
        id: string,
        payload: ILimitSKSPayload
    ): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.put<IApiResponseSuccess>(
                `/akademik/batas-sks/${id}`,
                payload
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating SKS Limit with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Deletes an SKS Limit rule.
     * DELETE /akademik/batas-sks/{id}
     */
    deleteLimitSKS: async (id: string): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.delete<IApiResponseSuccess>(
                `/akademik/batas-sks/${id}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error deleting SKS Limit with ID ${id}:`, error);
            throw error;
        }
    },
};