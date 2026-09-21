import { useSimpleMasterData } from './useSimpleMasterData';
import { slotWaktuService } from '../../api/admin-academic/slotWaktuService';
import { ISlotWaktu, ISlotWaktuPayload } from '../../types/models';

export const useSlotWaktu = () =>
    useSimpleMasterData<ISlotWaktu, ISlotWaktuPayload>('slotWaktu', slotWaktuService);
