import { createSimpleMasterDataService } from './simpleMasterDataService';
import { IKebutuhanKhusus, IKebutuhanKhususPayload } from '../../types/models';

export const kebutuhanKhususService = createSimpleMasterDataService<IKebutuhanKhusus, IKebutuhanKhususPayload>('/akademik/kebutuhan-khusus');
