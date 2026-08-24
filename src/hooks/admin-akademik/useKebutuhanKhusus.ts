import { useSimpleMasterData } from './useSimpleMasterData';
import { kebutuhanKhususService } from '../../api/admin-academic/kebutuhanKhususService';
import { IKebutuhanKhusus, IKebutuhanKhususPayload } from '../../types/models';

export const useKebutuhanKhusus = () =>
    useSimpleMasterData<IKebutuhanKhusus, IKebutuhanKhususPayload>('kebutuhanKhusus', kebutuhanKhususService);
