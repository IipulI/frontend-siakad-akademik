import { useSimpleMasterData } from './useSimpleMasterData';
import { sukuService } from '../../api/admin-academic/sukuService';
import { ISuku, ISukuPayload } from '../../types/models';

export const useSuku = () =>
    useSimpleMasterData<ISuku, ISukuPayload>('suku', sukuService);
