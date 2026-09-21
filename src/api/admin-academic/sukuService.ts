import { createSimpleMasterDataService } from './simpleMasterDataService';
import { ISuku, ISukuPayload } from '../../types/models';

export const sukuService = createSimpleMasterDataService<ISuku, ISukuPayload>('/akademik/suku');
