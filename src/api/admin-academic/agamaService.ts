import { createSimpleMasterDataService } from './simpleMasterDataService';
import { IAgama, IAgamaPayload } from '../../types/models';

export const agamaService = createSimpleMasterDataService<IAgama, IAgamaPayload>('/akademik/agama');
