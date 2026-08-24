import { useSimpleMasterData } from './useSimpleMasterData';
import { jenisMataKuliahService } from '../../api/admin-academic/jenisMataKuliahService';
import { IJenisMataKuliah, IJenisMataKuliahPayload } from '../../types/models';

export const useJenisMataKuliah = () =>
    useSimpleMasterData<IJenisMataKuliah, IJenisMataKuliahPayload>('jenisMataKuliah', jenisMataKuliahService);
