import { createSimpleMasterDataService } from './simpleMasterDataService';
import { IStatusMahasiswa, IStatusMahasiswaPayload } from '../../types/models';

export const statusMahasiswaService = createSimpleMasterDataService<IStatusMahasiswa, IStatusMahasiswaPayload>('/akademik/status-mahasiswa');
