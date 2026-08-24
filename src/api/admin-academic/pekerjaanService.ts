import { createSimpleMasterDataService } from './simpleMasterDataService';
import { IPekerjaan, IPekerjaanPayload } from '../../types/models';

export const pekerjaanService = createSimpleMasterDataService<IPekerjaan, IPekerjaanPayload>('/akademik/pekerjaan');
