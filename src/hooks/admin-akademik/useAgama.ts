import { useSimpleMasterData } from './useSimpleMasterData';
import { agamaService } from '../../api/admin-academic/agamaService';
import { IAgama, IAgamaPayload } from '../../types/models';

export const useAgama = () =>
    useSimpleMasterData<IAgama, IAgamaPayload>('agama', agamaService);
