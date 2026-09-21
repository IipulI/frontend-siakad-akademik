import { createSimpleMasterDataService } from './simpleMasterDataService';
import { IPenghasilan, IPenghasilanPayload } from '../../types/models';

export const penghasilanService = createSimpleMasterDataService<IPenghasilan, IPenghasilanPayload>('/akademik/penghasilan-pekerjaan');
