import { useSimpleMasterData } from './useSimpleMasterData';
import { statusMahasiswaService } from '../../api/admin-academic/statusMahasiswaService';
import { IStatusMahasiswa, IStatusMahasiswaPayload } from '../../types/models';

export const useStatusMahasiswa = () =>
    useSimpleMasterData<IStatusMahasiswa, IStatusMahasiswaPayload>('statusMahasiswa', statusMahasiswaService);
