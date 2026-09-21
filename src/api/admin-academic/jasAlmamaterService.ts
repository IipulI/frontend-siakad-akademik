import { createSimpleMasterDataService } from './simpleMasterDataService';
import { IJasAlmamater, IJasAlmamaterPayload } from '../../types/models';

export const jasAlmamaterService = createSimpleMasterDataService<IJasAlmamater, IJasAlmamaterPayload>('/akademik/jas-almamater');
