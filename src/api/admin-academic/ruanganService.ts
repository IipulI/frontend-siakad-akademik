import { createSimpleMasterDataService } from './simpleMasterDataService';
import { IRuangan, IRuanganPayload } from '../../types/models';

export const ruanganService = createSimpleMasterDataService<IRuangan, IRuanganPayload>('/akademik/ruangan');
