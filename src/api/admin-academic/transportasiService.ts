import { createSimpleMasterDataService } from './simpleMasterDataService';
import { ITransportasi, ITransportasiPayload } from '../../types/models';

export const transportasiService = createSimpleMasterDataService<ITransportasi, ITransportasiPayload>('/akademik/transportasi');
