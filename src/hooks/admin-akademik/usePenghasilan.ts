import { useSimpleMasterData } from './useSimpleMasterData';
import { penghasilanService } from '../../api/admin-academic/penghasilanService';
import { IPenghasilan, IPenghasilanPayload } from '../../types/models';

export const usePenghasilan = () =>
    useSimpleMasterData<IPenghasilan, IPenghasilanPayload>('penghasilan', penghasilanService);
