// src/api/admin-akademik/academicYearService.ts
import { Api } from '../Index';
import { IAcademicYear, IAcademicYearPayload } from '../../types/models';
import { IPaginatedResponse, IApiResponseSuccess } from '../../types/common.types';

interface GetAcademicYearsParams {
    keyword?: string;
    page?: number;
    size?: number;
    sort?: string;
}

export const academicYearService = {
    getAcademicYears: async (params: GetAcademicYearsParams = {}): Promise<IPaginatedResponse<IAcademicYear>> => {
        try {
            const response = await Api.get<IPaginatedResponse<IAcademicYear>>('/akademik/tahun-ajaran', {
                params: {
                    keyword: params.keyword || '',
                    page: params.page || 1,
                    size: params.size || 10,
                    sort: params.sort || 'createdAt,desc',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching academic years:', error);
            throw error;
        }
    },
    createAcademicYear: async (payload: IAcademicYearPayload): Promise<IApiResponseSuccess> => {
        const response = await Api.post<IApiResponseSuccess>('/akademik/tahun-ajaran', payload);
        return response.data;
    },
    updateAcademicYear: async (id: string, payload: IAcademicYearPayload): Promise<IApiResponseSuccess> => {
        const response = await Api.put<IApiResponseSuccess>(`/akademik/tahun-ajaran/${id}`, payload);
        return response.data;
    },
    deleteAcademicYear: async (id: string): Promise<IApiResponseSuccess> => {
        const response = await Api.delete<IApiResponseSuccess>(`/akademik/tahun-ajaran/${id}`);
        return response.data;
    },
};