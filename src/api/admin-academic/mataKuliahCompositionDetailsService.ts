// src/api/admin-akademik/mataKuliahCompositionDetailsService.ts
import { Api } from '../Index';
import { IMataKuliahCompositionDetailsResponse } from '../../types/models';

export const mataKuliahCompositionDetailsService = {
    getMataKuliahComposition: async (mataKuliahId: string): Promise<IMataKuliahCompositionDetailsResponse[]> => {
        try {
            const response = await Api.get<{ data: IMataKuliahCompositionDetailsResponse[], status: string, message: string }>(
                `/akademik/komposisi-nilai-mata-kuliah/${mataKuliahId}`
            );
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching composition details for mata kuliah ID ${mataKuliahId}:`, error);
            throw error;
        }
    },
};