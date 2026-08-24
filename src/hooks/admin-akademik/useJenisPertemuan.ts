import { useSimpleMasterData } from './useSimpleMasterData';
import { jenisPertemuanService } from '../../api/admin-academic/jenisPertemuanService';
import { IJenisPertemuan, IJenisPertemuanPayload } from '../../types/models';

export const useJenisPertemuan = () =>
    useSimpleMasterData<IJenisPertemuan, IJenisPertemuanPayload>('jenisPertemuan', jenisPertemuanService);
