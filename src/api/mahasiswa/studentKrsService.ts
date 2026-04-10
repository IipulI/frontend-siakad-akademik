// src/api/mahasiswa/studentKrsService.ts
import { Api } from '../Index';
import { IKrsInfo, IAvailableCourse, ISavedKrsResponse, IAddKrsPayload } from '../../types/mahasiswa.types';
import { IPaginatedResponse, IApiResponseSuccess } from '../../types/common.types'; // Dari file common.types.ts

// Definisikan tipe untuk parameter pencarian dan paginasi
interface GetKrsParams {
    page: number;
    size: number;
    keyword: string;
    sort?: string;
}

export const studentKrsService = {
    /**
     * Mengambil data info ringkasan KRS
     * GET /mahasiswa/krs/info-krs
     */
    getKrsInfo: async (): Promise<IKrsInfo> => {
        try {
            const response = await Api.get<{ data: IKrsInfo }>('/mahasiswa/krs/info-krs');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching KRS info:', error);
            throw error;
        }
    },

    /**
     * Mengambil daftar kelas yang tersedia dengan paginasi dan pencarian
     * GET /mahasiswa/krs?page=...&size=...&keyword=...
     */
    getAvailableCourses: async (params: GetKrsParams): Promise<IPaginatedResponse<IAvailableCourse>> => {
        try {
            const response = await Api.get<IPaginatedResponse<IAvailableCourse>>('/mahasiswa/krs', {
                params: {
                    page: params.page,
                    size: params.size,
                    keyword: params.keyword,
                    sort: params.sort || 'createdAt,desc',
                },
            });
            return response.data; // API Anda sudah mengembalikan struktur paginasi yang pas
        } catch (error) {
            console.error('Error fetching available courses:', error);
            throw error;
        }
    },

    /**
     * Mengambil daftar KRS yang sudah disimpan (status menunggu/draft)
     * GET /mahasiswa/krs/status-menunggu
     */
    getSavedCourses: async (): Promise<ISavedKrsResponse> => {
        try {
            const response = await Api.get<{ data: ISavedKrsResponse }>('/mahasiswa/krs/status-menunggu');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching saved KRS:', error);
            throw error;
        }
    },

    /**
     * Menambahkan kelas-kelas yang dipilih ke dalam KRS mahasiswa.
     * POST /mahasiswa/krs
     */
    addCoursesToKrs: async (payload: IAddKrsPayload): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.post<IApiResponseSuccess>('/mahasiswa/krs', payload);
            return response.data;
        } catch (error) {
            console.error('Error adding courses to KRS:', error);
            throw error;
        }
    },

    updateKrsCourses: async (payload: IAddKrsPayload): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.put<IApiResponseSuccess>(`/mahasiswa/krs`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating KRS:', error);
            throw error;
        }
    },

    submitKrsForApproval: async (): Promise<IApiResponseSuccess> => {
        try {
            // Endpoint ini tidak memerlukan request body, hanya trigger status change
            const response = await Api.put<IApiResponseSuccess>('/mahasiswa/krs/status');
            return response.data;
        } catch (error) {
            console.error('Error submitting KRS:', error);
            throw error;
        }
    },
};