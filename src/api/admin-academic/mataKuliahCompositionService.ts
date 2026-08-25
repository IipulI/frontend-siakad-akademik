// src/api/admin-akademik/mataKuliahCompositionService.ts
import { Api } from '../Index';
import { IMataKuliahCompositionPayload } from '../../types/models';
import { IApiResponseSuccess } from '../../types/common.types';

export const mataKuliahCompositionService = {
    assignMataKuliahComposition: async (payload: IMataKuliahCompositionPayload): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.post<IApiResponseSuccess>('/akademik/komposisi-nilai-mata-kuliah', payload);
            return response.data;
        } catch (error) {
            console.error('Error assigning single composition to mata kuliah:', error);
            throw error;
        }
    },
};