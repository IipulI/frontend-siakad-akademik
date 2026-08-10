// src/api/admin-akademik/gradeCompositionService.ts
import { Api } from '../Index';
import { IGradeComposition, IGradeCompositionPayload } from '../../types/models';
import { IApiResponseSuccess } from '../../types/common.types';

interface GetGradeCompositionsParams {
    tahunKurikulumId?: string;
}

export const gradeCompositionService = {
    getGradeCompositions: async (params: GetGradeCompositionsParams = {}): Promise<IGradeComposition[]> => {
        try {
            const response = await Api.get<{ data: IGradeComposition[], status: string, message: string }>(
                '/akademik/komposisi-nilai',
                { params: { tahunKurikulumId: params.tahunKurikulumId || '' } }
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching Grade Compositions:', error);
            throw error;
        }
    },

    createGradeComposition: async (payload: IGradeCompositionPayload): Promise<IApiResponseSuccess> => {
        const response = await Api.post<IApiResponseSuccess>('/akademik/komposisi-nilai', payload);
        return response.data;
    },
    updateGradeComposition: async (id: string, payload: IGradeCompositionPayload): Promise<IApiResponseSuccess> => {
        const response = await Api.put<IApiResponseSuccess>(`/akademik/komposisi-nilai/${id}`, payload);
        return response.data;
    },
    deleteGradeComposition: async (id: string): Promise<IApiResponseSuccess> => {
        const response = await Api.delete<IApiResponseSuccess>(`/akademik/komposisi-nilai/${id}`);
        return response.data;
    },
};