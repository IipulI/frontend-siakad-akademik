import { createSimpleMasterDataService } from './simpleMasterDataService';
import { IJenisMataKuliah, IJenisMataKuliahPayload } from '../../types/models';

export const jenisMataKuliahService = createSimpleMasterDataService<IJenisMataKuliah, IJenisMataKuliahPayload>('/akademik/jenis-mata-kuliah');
