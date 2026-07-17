// src/api/mahasiswa/studentAcademicService.ts
import { Api } from '../Index';
// Import the new interface that matches the API response
import { IStudentBiodata,
    IApiRetakeCourse,
    IStudentGradeCourse,
    IApiKrsHistoryResponse,
    IAcademicPeriod
} from '../../types/mahasiswa.types';

export const studentAcademicService = {
    getStudentBiodata: async (): Promise<IStudentBiodata> => {
        try {
            const response = await Api.get<{ data: IStudentBiodata }>('/mahasiswa/biodata');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching student biodata:', error);
            throw error;
        }
    },

    /**
     * Fetches the list of retake courses for the logged-in student.
     * USES THE CORRECT ENDPOINT AND RESPONSE TYPE.
     */
    getRetakeCourses: async (): Promise<IApiRetakeCourse[]> => {
        try {
            // Using the correct URL you provided
            const response = await Api.get<{ data: IApiRetakeCourse[] }>('/mahasiswa/krs/mengulang');
            // The API response has a top-level 'data' property
            return response.data.data;
        } catch (error) {
            console.error('Error fetching retake courses:', error);
            throw error;
        }
    },

    /**
     * Fetches the list of grades for a specific academic period.
     * GET /mahasiswa/krs/komposisi-nilai?namaPeriode=...
     */
    getStudentGrades: async (periode: string): Promise<IStudentGradeCourse[]> => {
        try {
            const response = await Api.get<{ data: IStudentGradeCourse[] }>(
                '/mahasiswa/krs/komposisi-nilai',
                {
                    params: { namaPeriode: periode },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching student grades:', error);
            throw error;
        }
    },

    /**
     * Fetches a list of available academic periods for the student.
     * NOTE: The endpoint '/mahasiswa/akademik/periode-list' is an assumption.
     * Please verify and update with your actual endpoint.
     */
    getAvailablePeriods: async (): Promise<IAcademicPeriod[]> => {
        try {
            // Using the correct endpoint now
            const response = await Api.get<{ data: IAcademicPeriod[] }>('/periode-akademik/dropdown');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching available periods:', error);
            throw error;
        }
    },

    /**
     * Mengambil data riwayat KRS untuk periode tertentu.
     * GET /mahasiswa/krs/riwayat-krs/?namaPeriode=...
     */
    getKrsHistory: async (periode: string): Promise<IApiKrsHistoryResponse> => {
        try {
            const response = await Api.get<{ data: IApiKrsHistoryResponse }>(
                '/mahasiswa/krs/riwayat-krs/',
                {
                    params: { periodeId: periode },
                }
            );
            // Mengembalikan keseluruhan objek data, termasuk totalSks dan batasSks
            return response.data.data;
        } catch (error) {
            console.error('Error fetching KRS history:', error);
            throw error;
        }
    },
};