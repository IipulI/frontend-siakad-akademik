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
        } catch (error: any) {
            console.error('Error fetching KRS info:', error);
            // Fallback data jika endpoint belum ada di backend lokal
            if (error.response?.status === 404) {
                return {
                    statusKrs: "Belum Diajukan",
                    semester: 4,
                    batasSks: 24,
                    periodeAkademik: "2024/2025 Genap",
                    pembimbingAkademik: "Dosen Pembimbing (Lokal)"
                };
            }
            throw error;
        }
    },

    /**
     * Mengambil daftar kelas yang tersedia dengan paginasi dan pencarian
     * GET /mahasiswa/krs?page=...&size=...&keyword=...
     */
    getAvailableCourses: async (params: GetKrsParams): Promise<IPaginatedResponse<IAvailableCourse>> => {
        try {
            const response = await Api.get<any>('/mahasiswa/krs', {
                params: {
                    page: params.page,
                    size: params.size,
                    search: params.keyword,
                    sort: params.sort || 'createdAt,desc',
                },
            });

            const rawData = response.data;

            // Jika backend mengembalikan data dalam format { status, message, data: [] }
            // Kita transform menjadi IPaginatedResponse
            return {
                data: rawData.data || [],
                totalItems: rawData.pagination?.totalItems || (rawData.data?.length || 0),
                totalPages: rawData.pagination?.totalPage || 1,
                currentPage: rawData.pagination?.currentPage || 1,
            };
        } catch (error) {
            console.error('Error fetching available courses:', error);
            throw error;
        }
    },

    /**
     * Mengambil daftar KRS yang sudah disimpan (status menunggu/draft)
     * GET /mahasiswa/krs/status-menunggu
     */
    getSavedCourses: async (): Promise<any> => {
        try {
            const response = await Api.get<any>('/mahasiswa/krs/status-menunggu');
            const dataObj = response.data.data;
            const courses = dataObj?.rincianKrsMahasiswa || [];

            // Hitung total SKS dari data yang ada
            const totalSks = courses.reduce((sum: number, item: any) => sum + (item.mataKuliah?.totalSks || 0), 0);

            return {
                id: dataObj?.id,
                status: dataObj?.status,
                rincianKrsMahasiswa: courses,
                krs: courses,
                totalSks: totalSks
            };
        } catch (error) {
            console.error('Error fetching saved KRS:', error);
            throw error;
        }
    },

    /**
     * Menambahkan kelas-kelas yang dipilih ke dalam KRS mahasiswa.
     * POST /mahasiswa/krs
     */
    addCoursesToKrs: async (payload: any): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.post<IApiResponseSuccess>('/mahasiswa/krs', {
                kelasKuliahIds: payload.kelasIds || payload.kelasKuliahIds
            });
            return response.data;
        } catch (error) {
            console.error('Error adding courses to KRS:', error);
            throw error;
        }
    },

    updateKrsCourses: async (krsId: string, payload: IAddKrsPayload): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.put<IApiResponseSuccess>(`/mahasiswa/krs/`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating KRS:', error);
            throw error;
        }
    },

    submitKrsForApproval: async (): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.post<IApiResponseSuccess>('/mahasiswa/krs/ajukan', {});
            return response.data;
        } catch (error) {
            console.error('Error submitting KRS:', error);
            throw error;
        }
    },

    deleteKrs: async (krsId: string, kelasKuliahIds: string[]): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.delete<IApiResponseSuccess>(`/mahasiswa/krs/${krsId}`, {
                data: { kelasKuliahIds }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting KRS item:', error);
            throw error;
        }
    },

    getKrsHistory: async (periodeId: string): Promise<any> => {
        try {
            const response = await Api.get('/mahasiswa/krs/riwayat-krs', {
                params: { periodeId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching KRS history:', error);
            throw error;
        }
    },
};