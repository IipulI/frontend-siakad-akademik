// src/api/admin-akademik/programStudiService.ts
import { Api } from '../Index';
import { IProgramStudi } from '../../types/models';

export const programStudiService = {
    getProgramStudi: async (): Promise<IProgramStudi[]> => {
        try {
            const response = await Api.get<{ data: any[], status: string, message: string }>('/program-studi');
            // Backend mengembalikan field mentah model (nama, siakJenjangId, dst),
            // bukan bentuk IProgramStudi -- petakan di sini biar semua pemakai
            // getProdi() dapat data yang konsisten.
            return response.data.data.map((item) => ({
                id: item.id,
                kode: item.kode,
                nama: item.nama,
                jenjang: item.jenjang ?? { id: item.siakJenjangId ?? "", nama: "", jenjang: "" },
            }));
        } catch (error) {
            console.error('Error fetching Program Studi:', error);
            throw error;
        }
    },
};