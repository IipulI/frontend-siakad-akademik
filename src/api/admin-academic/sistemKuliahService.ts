import { createSimpleMasterDataService } from './simpleMasterDataService';
import { ISistemKuliah, ISistemKuliahPayload } from '../../types/models';

export const sistemKuliahService = createSimpleMasterDataService<ISistemKuliah, ISistemKuliahPayload>('/akademik/sistem-kuliah');
