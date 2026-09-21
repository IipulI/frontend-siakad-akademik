import { useSimpleMasterData } from './useSimpleMasterData';
import { pekerjaanService } from '../../api/admin-academic/pekerjaanService';
import { IPekerjaan, IPekerjaanPayload } from '../../types/models';

export const usePekerjaan = () =>
    useSimpleMasterData<IPekerjaan, IPekerjaanPayload>('pekerjaan', pekerjaanService);
