import { createSimpleMasterDataService } from './simpleMasterDataService';
import { ISlotWaktu, ISlotWaktuPayload } from '../../types/models';

export const slotWaktuService = createSimpleMasterDataService<ISlotWaktu, ISlotWaktuPayload>('/akademik/slot-waktu');
