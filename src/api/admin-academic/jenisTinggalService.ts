import { createSimpleMasterDataService } from './simpleMasterDataService';
import { IJenisTinggal, IJenisTinggalPayload } from '../../types/models';

export const jenisTinggalService = createSimpleMasterDataService<IJenisTinggal, IJenisTinggalPayload>('/akademik/jenis-tinggal');
