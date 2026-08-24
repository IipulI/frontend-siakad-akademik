import { useSimpleMasterData } from './useSimpleMasterData';
import { sistemKuliahService } from '../../api/admin-academic/sistemKuliahService';
import { ISistemKuliah, ISistemKuliahPayload } from '../../types/models';

export const useSistemKuliah = () =>
    useSimpleMasterData<ISistemKuliah, ISistemKuliahPayload>('sistemKuliah', sistemKuliahService);
