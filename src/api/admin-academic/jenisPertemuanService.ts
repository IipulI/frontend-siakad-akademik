import { createSimpleMasterDataService } from './simpleMasterDataService';
import { IJenisPertemuan, IJenisPertemuanPayload } from '../../types/models';

export const jenisPertemuanService = createSimpleMasterDataService<IJenisPertemuan, IJenisPertemuanPayload>('/akademik/jenis-pertemuan');
