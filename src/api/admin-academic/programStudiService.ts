// src/api/admin-akademik/programStudiService.ts
import { Api } from '../Index';
import { IProgramStudi } from '../../types/models';

export const programStudiService = {
    getProgramStudi: async (): Promise<IProgramStudi[]> => {
        try {
            const response = await Api.get<{ data: IProgramStudi[], status: string, message: string }>('/akademik/program-studi');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching Program Studi:', error);
            throw error;
        }
    },
};