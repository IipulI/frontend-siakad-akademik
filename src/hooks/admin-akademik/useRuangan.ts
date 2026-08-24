import { useSimpleMasterData } from './useSimpleMasterData';
import { ruanganService } from '../../api/admin-academic/ruanganService';
import { IRuangan, IRuanganPayload } from '../../types/models';

export const useRuangan = () =>
    useSimpleMasterData<IRuangan, IRuanganPayload>('ruangan', ruanganService);
