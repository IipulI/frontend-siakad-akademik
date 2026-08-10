// src/api/admin-akademik/mataKuliahService.ts
import { Api } from '../Index';
import { IMataKuliahAdmin } from '../../types/models';
import { IPaginatedResponse } from '../../types/common.types';

interface GetMataKuliahParams {
    programStudi: string;
    tahunKurikulum: string;
    page?: number;
    size?: number;
    sort?: string;
}

export const mataKuliahService = {
    getMataKuliah: async (params: GetMataKuliahParams): Promise<IPaginatedResponse<IMataKuliahAdmin>> => {
        try {
            const response = await Api.get<IPaginatedResponse<IMataKuliahAdmin>>('/akademik/mata-kuliah', {
                params: {
                    programStudi: params.programStudi,
                    tahunKurikulum: params.tahunKurikulum,
                    page: params.page || 1,
                    size: params.size || 1000,
                    sort: params.sort || 'createdAt,desc',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Mata Kuliah:', error);
            throw error;
        }
    },
};