import { useSimpleMasterData } from './useSimpleMasterData';
import { transportasiService } from '../../api/admin-academic/transportasiService';
import { ITransportasi, ITransportasiPayload } from '../../types/models';

export const useTransportasi = () =>
    useSimpleMasterData<ITransportasi, ITransportasiPayload>('transportasi', transportasiService);
