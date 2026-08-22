// src/api/admin-academic/periodService.ts
import { Api } from '../Index'; // Your Axios instance
import {
    IPeriod,
    IPeriodPayload,
} from '../../types/models';
import { IPaginatedResponse, IApiResponseSuccess } from '../../types/common.types';

/**
 * Interface for parameters when fetching academic periods.
 * Matches your GET endpoint's query parameters.
 */
interface GetPeriodsParams {
    keyword?: string; // Corresponds to your 'keyword' parameter
    page?: number;
    size?: number; // Corresponds to your 'size' parameter
    sort?: string; // e.g., "createdAt,desc"
}

export const periodService = {
    /**
     * Fetches a paginated list of academic periods from the API.
     * GET /akademik/periode-akademik?keyword=...&page=...&size=...&sort=...
     */
    getPeriods: async (
        params: GetPeriodsParams = {}
    ): Promise<IPaginatedResponse<IPeriod>> => {
        try {
            const response = await Api.get<IPaginatedResponse<IPeriod>>(
                '/akademik/periode-akademik',
                {
                    params: {
                        keyword: params.keyword || '',
                        page: params.page || 1,
                        size: params.size || 10,
                        sort: params.sort || 'createdAt,desc', // Default sort
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching academic periods:', error);
            throw error;
        }
    },

    /**
     * Creates a new academic period.
     * POST /akademik/periode-akademik
     */
    createPeriod: async (
        payload: IPeriodPayload
    ): Promise<IApiResponseSuccess> => {
        try {
            // Backend butuh "nama"/"kode" (bukan namaPeriode/kodePeriode dari
            // IPeriodPayload) -- di-map di sini biar tipe form-nya gak usah
            // ngikutin nama field backend.
            const response = await Api.post<IApiResponseSuccess>(
                '/akademik/periode-akademik',
                {
                    siakTahunAjaranId: payload.siakTahunAjaranId,
                    nama: payload.namaPeriode,
                    kode: payload.kodePeriode,
                    tanggalMulai: payload.tanggalMulai,
                    tanggalSelesai: payload.tanggalSelesai,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating academic period:', error);
            throw error;
        }
    },

    /**
     * Updates an existing academic period.
     * PUT /akademik/periode-akademik/{id}
     */
    updatePeriod: async (
        id: string,
        payload: IPeriodPayload
    ): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.put<IApiResponseSuccess>(
                `/akademik/periode-akademik/${id}`,
                {
                    siakTahunAjaranId: payload.siakTahunAjaranId,
                    nama: payload.namaPeriode,
                    kode: payload.kodePeriode,
                    tanggalMulai: payload.tanggalMulai,
                    tanggalSelesai: payload.tanggalSelesai,
                    status: payload.status,
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating academic period with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Deletes an academic period.
     * DELETE /akademik/periode-akademik/{id}
     */
    deletePeriod: async (id: string): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.delete<IApiResponseSuccess>(
                `/akademik/periode-akademik/${id}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error deleting academic period with ID ${id}:`, error);
            throw error;
        }
    },
};