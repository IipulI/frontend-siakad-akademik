import { Api } from '../Index';

export interface IFakultasOption {
    id: string;
    nama: string;
}

export const fakultasService = {
    getAll: async (): Promise<IFakultasOption[]> => {
        const response = await Api.get<{ data: IFakultasOption[] }>('/public/fakultas');
        return response.data.data;
    },
};
