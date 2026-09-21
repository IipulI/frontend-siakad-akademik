// src/api/admin-academic/simpleMasterDataService.ts
import { Api } from '../Index';
import { IApiResponseSuccess } from '../../types/common.types';

export interface ISimpleMasterDataService<T, TPayload> {
    getAll: () => Promise<T[]>;
    create: (payload: TPayload) => Promise<IApiResponseSuccess>;
    update: (id: string, payload: TPayload) => Promise<IApiResponseSuccess>;
    remove: (id: string) => Promise<IApiResponseSuccess>;
}

/**
 * Factory untuk endpoint "Data Pelengkap" yang berbentuk lookup CRUD sederhana
 * (GET /, POST /, PUT /:id, DELETE /:id) dengan bentuk response { status, message, data }.
 */
export function createSimpleMasterDataService<T, TPayload>(
    basePath: string
): ISimpleMasterDataService<T, TPayload> {
    return {
        getAll: async () => {
            const response = await Api.get<{ data: T[] }>(basePath);
            return response.data.data;
        },
        create: async (payload) => {
            const response = await Api.post<IApiResponseSuccess>(basePath, payload);
            return response.data;
        },
        update: async (id, payload) => {
            const response = await Api.put<IApiResponseSuccess>(`${basePath}/${id}`, payload);
            return response.data;
        },
        remove: async (id) => {
            const response = await Api.delete<IApiResponseSuccess>(`${basePath}/${id}`);
            return response.data;
        },
    };
}
