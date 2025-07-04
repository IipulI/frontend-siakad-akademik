import { Api } from '../Index';
// Import the new types we just created
import { MahasiswaProfile } from '../../types/mahasiswa.types';

export const getMahasiswaProfile = async (id: string): Promise<MahasiswaProfile> => {
    try {
        // The response has a `data` object which contains our profile data
        const response = await Api.get<{ data: MahasiswaProfile }>(`/mahasiswa/profile/${id}`);
        return response.data.data; // We return the nested data object
    } catch (error) {
        console.error(`Failed to fetch profile for ID ${id}`, error);
        // Re-throw the error to be handled by the calling component or hook
        throw error;
    }
};