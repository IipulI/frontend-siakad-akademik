import { Api } from '../Index';
import { IApiResponseSuccess } from '../../types/common.types';
import { IKonsentrasi, IKonsentrasiPayload } from '../../types/models';

const basePath = '/akademik/konsentrasi';

export const konsentrasiService = {
    getAll: async (programStudiId: string): Promise<IKonsentrasi[]> => {
        const response = await Api.get<{ data: IKonsentrasi[] }>(basePath, {
            params: { programStudiId },
        });
        return response.data.data;
    },
    create: async (payload: IKonsentrasiPayload): Promise<IApiResponseSuccess> => {
        const response = await Api.post<IApiResponseSuccess>(basePath, payload);
        return response.data;
    },
    update: async (id: string, payload: IKonsentrasiPayload): Promise<IApiResponseSuccess> => {
        const response = await Api.put<IApiResponseSuccess>(`${basePath}/${id}`, payload);
        return response.data;
    },
    remove: async (id: string): Promise<IApiResponseSuccess> => {
        const response = await Api.delete<IApiResponseSuccess>(`${basePath}/${id}`);
        return response.data;
    },
};
